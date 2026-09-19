#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════════
#  learn-duckdb — One-Line Universal Installer (Linux & macOS)
#  https://github.com/haydermuhib/learn-duckdb
# ══════════════════════════════════════════════════════════════════════════════

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RED="\033[0;31m"
RESET="\033[0m"

REPO_URL="https://github.com/haydermuhib/learn-duckdb.git"
INSTALL_BIN_DIR="$HOME/.local/bin"

echo -e "${YELLOW}"
cat << "EOF"
  _                                     _            _         _ _     
 | | ___  __ _ _ __ _ __         __| |_   _  ___| | __  __| | |__  
 | |/ _ \/ _` | '__| '_ \ _____ / _` | | | |/ __| |/ / / _` | '_ \ 
 | |  __/ (_| | |  | | | |_____| (_| | |_| | (__|   < | (_| | |_) |
 |_|\___|\__,_|_|  |_| |_|      \__,_|\__,_|\___|_|\_(_)__,_|_.__/ 
EOF
echo -e "${RESET}"
echo -e "${CYAN}🦆 Installing learn-duckdb — Interactive Terminal SQL Learning...${RESET}\n"

mkdir -p "$INSTALL_BIN_DIR"

# 1. Check for uv (fastest zero-dependency python environment & tool manager)
if command -v uv >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Found uv package manager.${RESET}"
    UV_BIN="uv"
else
    echo -e "${YELLOW}⚡ uv not found. Installing standalone uv...${RESET}"
    curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1
    export PATH="$HOME/.local/bin:$PATH"
    if command -v uv >/dev/null 2>&1; then
        UV_BIN="uv"
        echo -e "${GREEN}✓ uv installed successfully.${RESET}"
    elif [ -f "$HOME/.cargo/bin/uv" ]; then
        UV_BIN="$HOME/.cargo/bin/uv"
        export PATH="$HOME/.cargo/bin:$PATH"
    else
        echo -e "${RED}❌ Could not install uv automatically. Please install Python 3.11+ or uv.${RESET}"
        exit 1
    fi
fi

# 2. Install learn-duckdb using uv tool
echo -e "${CYAN}📦 Packaging and installing learn-duckdb to ~/.local/bin/learn-duckdb...${RESET}"
"$UV_BIN" tool install --force "git+${REPO_URL}" >/dev/null 2>&1 || "$UV_BIN" tool install --force learn-duckdb >/dev/null 2>&1 || {
    echo -e "${YELLOW}Falling back to local build install...${RESET}"
    "$UV_BIN" tool install --force .
}

# 3. Ensure ~/.local/bin is in user PATH
SHELL_CONFIG=""
case "$SHELL" in
    */zsh)  SHELL_CONFIG="$HOME/.zshrc" ;;
    */bash) SHELL_CONFIG="$HOME/.bashrc" ;;
    *)      SHELL_CONFIG="$HOME/.profile" ;;
esac

PATH_EXPORT='export PATH="$HOME/.local/bin:$PATH"'
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    if [ -n "$SHELL_CONFIG" ] && [ -f "$SHELL_CONFIG" ]; then
        if ! grep -q '.local/bin' "$SHELL_CONFIG"; then
            echo "" >> "$SHELL_CONFIG"
            echo "# Added by learn-duckdb installer" >> "$SHELL_CONFIG"
            echo "$PATH_EXPORT" >> "$SHELL_CONFIG"
            echo -e "${GREEN}✓ Added ~/.local/bin to $SHELL_CONFIG${RESET}"
        fi
    fi
    export PATH="$HOME/.local/bin:$PATH"
fi

echo -e "\n${GREEN}${BOLD}🎉 Installation Complete!${RESET}"
echo -e "${CYAN}You can now launch learn-duckdb from anywhere in your terminal:${RESET}\n"
echo -e "   ${YELLOW}${BOLD}learn-duckdb${RESET}\n"
