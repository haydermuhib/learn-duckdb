import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  SnowflakeIcon,
  PythonIcon,
  DuckDBIcon,
  PostgresIcon,
  BigQueryIcon,
  SQLiteIcon,
  PrestoIcon,
  BuyMeACoffeeIcon,
  getBrandIcon,
  renderParityBadge,
} from '../src/components/common/BrandIcons';

describe('BrandIcons & Parity Badge Helper', () => {
  describe('Individual Icon Component Integrity', () => {
    it('should instantiate DuckDBIcon with correct SVG elements', () => {
      const rendered = DuckDBIcon({ className: 'w-4 h-4' });
      expect(rendered.type).toBe('svg');
      expect(rendered.props['aria-label']).toBe('DuckDB');
      expect(rendered.props.viewBox).toBe('0 0 24 24');
    });

    it('should instantiate SnowflakeIcon with default and custom colors', () => {
      const defaultIcon = SnowflakeIcon({});
      expect(defaultIcon.props['aria-label']).toBe('Snowflake');
      expect(defaultIcon.props.fill).toBe('#29B5E8');

      const customIcon = SnowflakeIcon({ color: '#00ffff' });
      expect(customIcon.props.fill).toBe('#00ffff');
    });

    it('should instantiate PythonIcon with dual-path structure', () => {
      const icon = PythonIcon({ className: 'w-6 h-6' });
      expect(icon.props['aria-label']).toBe('Python');
      expect(icon.props.viewBox).toBe('0 0 128 128');
      expect(icon.props.children).toBeDefined();
    });

    it('should instantiate PostgresIcon with PostgreSQL branding', () => {
      const icon = PostgresIcon({});
      expect(icon.props['aria-label']).toBe('PostgreSQL');
      expect(icon.props.fill).toBe('#336791');
    });

    it('should instantiate BigQueryIcon with Google BigQuery branding', () => {
      const icon = BigQueryIcon({});
      expect(icon.props['aria-label']).toBe('Google BigQuery');
      expect(icon.props.fill).toBe('#4285F4');
    });

    it('should instantiate SQLiteIcon with SQLite branding', () => {
      const icon = SQLiteIcon({});
      expect(icon.props['aria-label']).toBe('SQLite');
      expect(icon.props.fill).toBe('#003B57');
    });

    it('should instantiate PrestoIcon with Presto branding', () => {
      const icon = PrestoIcon({});
      expect(icon.props['aria-label']).toBe('Presto');
      expect(icon.props.fill).toBe('#DD00A1');
    });

    it('should instantiate BuyMeACoffeeIcon with official Buy Me a Coffee vector mark', () => {
      const icon = BuyMeACoffeeIcon({});
      expect(icon.props['aria-label']).toBe('Buy Me a Coffee');
      expect(icon.props.viewBox).toBe('0 0 24 24');
      expect(icon.props.className).toContain('fill-current');
    });
  });

  describe('getBrandIcon Resolver', () => {
    it('should resolve supported platforms case-insensitively', () => {
      const brands: [string, any][] = [
        ['duckdb', DuckDBIcon],
        ['DUCKDB', DuckDBIcon],
        ['snowflake', SnowflakeIcon],
        ['SNOWFLAKE', SnowflakeIcon],
        ['python', PythonIcon],
        ['postgres', PostgresIcon],
        ['postgresql', PostgresIcon],
        ['bigquery', BigQueryIcon],
        ['sqlite', SQLiteIcon],
        ['presto', PrestoIcon],
      ];

      for (const [input, expectedComponent] of brands) {
        const icon = getBrandIcon(input);
        expect(icon, `Expected icon for ${input}`).not.toBeNull();
        expect(icon?.type).toBe(expectedComponent);
      }
    });

    it('should return null for unsupported or generic keywords', () => {
      expect(getBrandIcon('mysql')).toBeNull();
      expect(getBrandIcon('oracle')).toBeNull();
      expect(getBrandIcon('ansi')).toBeNull();
      expect(getBrandIcon('')).toBeNull();
      expect(getBrandIcon('unknown')).toBeNull();
    });

    it('should apply custom className to resolved brand icon', () => {
      const icon = getBrandIcon('duckdb', 'w-8 h-8 custom-class');
      expect(icon?.props.className).toBe('w-8 h-8 custom-class');
    });
  });

  describe('renderParityBadge Parser & Renderer', () => {
    it('should accurately pair logos with corresponding technology names in "DuckDB & Snowflake Standard"', () => {
      const elements = renderParityBadge('DuckDB & Snowflake Standard');
      expect(Array.isArray(elements)).toBe(true);

      // Verify that DuckDB segment exists with DuckDBIcon
      const duckdbWrapper = elements.find(
        (el: any) =>
          React.isValidElement(el) &&
          React.Children.toArray((el.props as any).children).some(
            (c: any) => c?.props?.children === 'DuckDB'
          )
      ) as any;

      expect(duckdbWrapper).toBeDefined();

      const duckdbIconSpan = React.Children.toArray(duckdbWrapper.props.children)[0] as any;
      expect(duckdbIconSpan.props.children.type).toBe(DuckDBIcon);

      // Verify that Snowflake segment exists with SnowflakeIcon
      const snowflakeWrapper = elements.find(
        (el: any) =>
          React.isValidElement(el) &&
          React.Children.toArray((el.props as any).children).some(
            (c: any) => c?.props?.children === 'Snowflake'
          )
      ) as any;

      expect(snowflakeWrapper).toBeDefined();

      const snowflakeIconSpan = React.Children.toArray(snowflakeWrapper.props.children)[0] as any;
      expect(snowflakeIconSpan.props.children.type).toBe(SnowflakeIcon);

      // Crucial: DuckDB icon is DuckDB, NOT Snowflake
      expect(duckdbIconSpan.props.children.type).not.toBe(SnowflakeIcon);
    });

    it('should render single-brand badges like "Snowflake 1:1"', () => {
      const elements = renderParityBadge('Snowflake 1:1');
      expect(elements.length).toBeGreaterThan(1);
      
      const snowflakeWrapper = elements.find(
        (el: any) =>
          React.isValidElement(el) &&
          React.Children.toArray((el.props as any).children).some(
            (c: any) => c?.props?.children === 'Snowflake'
          )
      ) as any;

      expect(snowflakeWrapper).toBeDefined();
    });

    it('should render multi-system badges like "BigQuery & Snowflake 1:1" and "Postgres & DuckDB Standard"', () => {
      const bqElements = renderParityBadge('BigQuery & Snowflake 1:1');
      expect(bqElements.length).toBeGreaterThan(1);

      const pgElements = renderParityBadge('Postgres & DuckDB Standard');
      expect(pgElements.length).toBeGreaterThan(1);
    });

    it('should render plain text without icons for ANSI or generic standards', () => {
      const elements = renderParityBadge('ANSI SQL Standard');
      expect(elements.length).toBe(1);
      expect(elements[0].props.children).toBe('ANSI SQL Standard');
    });
  });
});
