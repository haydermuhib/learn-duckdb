"""Modal screen for software update notifications and in-place updates."""

from __future__ import annotations

from textual import work
from textual.app import ComposeResult
from textual.containers import Horizontal, Vertical
from textual.screen import ModalScreen
from textual.widgets import Button, Static

from src.engine.updater import UpdateInfo, UpdateManager


class UpdatePromptModal(ModalScreen[bool]):
    """Modal dialog prompting user to update learn-duckdb."""

    def __init__(self, info: UpdateInfo, **kwargs) -> None:
        super().__init__(**kwargs)
        self._info = info
        self._updater = UpdateManager(info.current_version)

    def compose(self) -> ComposeResult:
        with Vertical(id="update-dialog"):
            yield Static("🚀 Update Available!", id="update-title")
            yield Static(
                f"A new version of [bold #FEC62E]learn-duckdb[/] is available!\n"
                f"Current: [dim]v{self._info.current_version}[/]  ──►  Latest: [bold #73daca]v{self._info.latest_version}[/]\n",
                id="update-version-info",
            )
            if self._info.release_notes:
                yield Static(f"[dim]{self._info.release_notes[:300]}[/]", id="update-notes")
            yield Static("", id="update-status")
            with Horizontal(id="update-buttons"):
                yield Button("Later (Esc)", variant="default", id="btn-update-later")
                yield Button("Update Now", variant="primary", id="btn-update-now")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "btn-update-now":
            self._start_update_process()
        else:
            self.dismiss(False)

    def key_escape(self) -> None:
        self.dismiss(False)

    @work(thread=True)
    def _start_update_process(self) -> None:
        """Run update in a background thread to prevent UI freezing."""
        status_widget = self.query_one("#update-status", Static)
        btn_now = self.query_one("#btn-update-now", Button)
        btn_later = self.query_one("#btn-update-later", Button)

        self.app.call_from_thread(lambda: setattr(btn_now, "disabled", True))
        self.app.call_from_thread(lambda: setattr(btn_later, "disabled", True))
        self.app.call_from_thread(
            lambda: status_widget.update("⏳ [bold #FEC62E]Downloading and installing update...[/]")
        )

        success, message = self._updater.perform_update()

        if success:
            self.app.call_from_thread(
                lambda: status_widget.update("✅ [bold #9ece6a]Update complete! Please restart learn-duckdb.[/]")
            )
            self.app.call_from_thread(
                lambda: self.app.notify("learn-duckdb updated! Restart to apply changes.", title="🚀 Update Complete", severity="information")
            )
            self.app.call_from_thread(lambda: setattr(btn_later, "label", "Close (Esc)"))
            self.app.call_from_thread(lambda: setattr(btn_later, "disabled", False))
        else:
            self.app.call_from_thread(
                lambda: status_widget.update(f"❌ [bold #f7768e]{message}[/]")
            )
            self.app.call_from_thread(lambda: setattr(btn_later, "disabled", False))
