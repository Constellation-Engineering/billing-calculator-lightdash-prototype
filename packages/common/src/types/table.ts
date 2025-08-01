import { type ModelRequiredFilterRule } from './filter';
import type { DefaultTimeDimension } from './timeFrames';

export enum OrderFieldsByStrategy {
    LABEL = 'LABEL',
    INDEX = 'INDEX',
}

export type GroupType = {
    label: string;
    description?: string;
};

export type TableBase = {
    name: string; // Must be sql friendly (a-Z, 0-9, _)
    label: string; // Friendly name
    originalName?: string; // Original name from dbt, without alias
    description?: string; // Optional description of table
    database: string;
    schema: string;
    sqlTable: string; // The sql identifier for the table
    primaryKey?: string[];
    orderFieldsBy?: OrderFieldsByStrategy;
    groupLabel?: string;
    sqlWhere?: string;
    requiredFilters?: ModelRequiredFilterRule[];
    hidden?: boolean;
    requiredAttributes?: Record<string, string | string[]>;
    groupDetails?: Record<string, GroupType>;
    defaultTimeDimension?: DefaultTimeDimension;
    aiHint?: string | string[];
};
