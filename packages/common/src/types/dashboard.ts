import { type FilterableDimension } from './field';
import { type DashboardFilters } from './filter';
import { type DashboardParameters } from './parameters';
import { type ChartKind, type SavedChartType } from './savedCharts';
import { type SpaceShare } from './space';
import { type UpdatedByUser } from './user';
import { type ValidationSummary } from './validation';

export enum DashboardTileTypes {
    SAVED_CHART = 'saved_chart',
    SQL_CHART = 'sql_chart',
    MARKDOWN = 'markdown',
    LOOM = 'loom',
}

type CreateDashboardTileBase = {
    uuid?: string;
    type: DashboardTileTypes;
    x: number;
    y: number;
    h: number;
    w: number;
    tabUuid: string | undefined;
};

type DashboardTileBase = Required<CreateDashboardTileBase>;

export type DashboardMarkdownTileProperties = {
    type: DashboardTileTypes.MARKDOWN;
    properties: {
        title: string;
        content: string;
    };
};

export type DashboardLoomTileProperties = {
    type: DashboardTileTypes.LOOM;
    properties: {
        title: string;
        hideTitle?: boolean;
        url: string;
    };
};

export type DashboardChartTileProperties = {
    type: DashboardTileTypes.SAVED_CHART;
    properties: {
        title?: string;
        hideTitle?: boolean;
        savedChartUuid: string | null;
        belongsToDashboard?: boolean; // this should be required and not part of the "create" types, but we need to fix tech debt first. Open ticket https://github.com/lightdash/lightdash/issues/6450
        chartName?: string | null;
        lastVersionChartKind?: ChartKind | null;
        chartSlug?: string;
    };
};

export type DashboardSqlChartTileProperties = {
    type: DashboardTileTypes.SQL_CHART;
    properties: {
        title?: string;
        savedSqlUuid: string | null;
        chartName: string;
        hideTitle?: boolean;
        chartSlug?: string;
    };
};

export type CreateDashboardMarkdownTile = CreateDashboardTileBase &
    DashboardMarkdownTileProperties;
export type DashboardMarkdownTile = DashboardTileBase &
    DashboardMarkdownTileProperties;

export type CreateDashboardLoomTile = CreateDashboardTileBase &
    DashboardLoomTileProperties;
export type DashboardLoomTile = DashboardTileBase & DashboardLoomTileProperties;

export type CreateDashboardChartTile = CreateDashboardTileBase &
    DashboardChartTileProperties;
export type DashboardChartTile = DashboardTileBase &
    DashboardChartTileProperties;

export type CreateDashboardSqlChartTile = CreateDashboardTileBase &
    DashboardSqlChartTileProperties;
export type DashboardSqlChartTile = DashboardTileBase &
    DashboardSqlChartTileProperties;

export type CreateDashboard = {
    name: string;
    description?: string;
    tiles: Array<
        | CreateDashboardChartTile
        | CreateDashboardMarkdownTile
        | CreateDashboardLoomTile
        | CreateDashboardSqlChartTile
    >;
    filters?: DashboardFilters;
    parameters?: DashboardParameters;
    updatedByUser?: Pick<UpdatedByUser, 'userUuid'>;
    spaceUuid?: string;
    tabs: DashboardTab[];
    config?: DashboardConfig;
};

export type DashboardTile =
    | DashboardChartTile
    | DashboardMarkdownTile
    | DashboardLoomTile
    | DashboardSqlChartTile;

export const isDashboardChartTileType = (
    tile: DashboardTile,
): tile is DashboardChartTile => tile.type === DashboardTileTypes.SAVED_CHART;

export const isDashboardMarkdownTileType = (
    tile: DashboardTile,
): tile is DashboardMarkdownTile => tile.type === DashboardTileTypes.MARKDOWN;

export const isDashboardLoomTileType = (
    tile: DashboardTile,
): tile is DashboardLoomTile => tile.type === DashboardTileTypes.LOOM;

export const isDashboardSqlChartTile = (
    tile: DashboardTileBase,
): tile is DashboardSqlChartTile => tile.type === DashboardTileTypes.SQL_CHART;

export type DashboardTab = {
    uuid: string;
    name: string;
    order: number;
};

export type DashboardTabWithUrls = DashboardTab & {
    nextUrl: string | null;
    prevUrl: string | null;
    selfUrl: string;
};

export type DashboardDAO = Omit<Dashboard, 'isPrivate' | 'access'>;

export type DashboardConfig = {
    isDateZoomDisabled: boolean;
};

export type Dashboard = {
    organizationUuid: string;
    projectUuid: string;
    dashboardVersionId: number;
    uuid: string;
    name: string;
    description?: string;
    updatedAt: Date;
    tiles: Array<DashboardTile>;
    filters: DashboardFilters;
    parameters?: DashboardParameters;
    updatedByUser?: UpdatedByUser;
    spaceUuid: string;
    spaceName: string;
    views: number;
    firstViewedAt: Date | string | null;
    pinnedListUuid: string | null;
    pinnedListOrder: number | null;
    tabs: DashboardTab[];
    isPrivate: boolean | null;
    access: SpaceShare[] | null;
    slug: string;
    config?: DashboardConfig;
};

export enum DashboardSummaryTone {
    FRIENDLY = 'friendly',
    FORMAL = 'formal',
    DIRECT = 'direct',
    ENTHUSIASTIC = 'enthusiastic',
}

export type DashboardSummary = {
    dashboardSummaryUuid: string;
    dashboardUuid: string;
    dashboardVersionId: number;
    context?: string | null;
    tone: DashboardSummaryTone;
    audiences: string[];
    summary: string;
    createdAt: Date;
};

export type DashboardBasicDetails = Pick<
    Dashboard,
    | 'uuid'
    | 'name'
    | 'description'
    | 'updatedAt'
    | 'projectUuid'
    | 'updatedByUser'
    | 'organizationUuid'
    | 'spaceUuid'
    | 'views'
    | 'firstViewedAt'
    | 'pinnedListUuid'
    | 'pinnedListOrder'
> & { validationErrors?: ValidationSummary[] };

export type DashboardBasicDetailsWithTileTypes = DashboardBasicDetails & {
    tileTypes: DashboardTileTypes[];
};

export type SpaceDashboard = DashboardBasicDetails;

export type DashboardUnversionedFields = Pick<
    CreateDashboard,
    'name' | 'description' | 'spaceUuid'
>;

export type DashboardVersionedFields = Pick<
    CreateDashboard,
    'tiles' | 'filters' | 'parameters' | 'updatedByUser' | 'tabs' | 'config'
>;

export type UpdateDashboardDetails = Pick<Dashboard, 'name' | 'description'>;

export type UpdateDashboard =
    | DashboardUnversionedFields
    | DashboardVersionedFields
    | (DashboardUnversionedFields & DashboardVersionedFields);

export type UpdateMultipleDashboards = Pick<
    Dashboard,
    'uuid' | 'name' | 'description' | 'spaceUuid'
>;

export type DashboardAvailableFilters = {
    savedQueryFilters: Record<string, number[]>;
    allFilterableFields: FilterableDimension[];
};

export type SavedChartsInfoForDashboardAvailableFilters = {
    tileUuid: string;
    savedChartUuid: string;
}[];

export const isDashboardUnversionedFields = (
    data: UpdateDashboard,
): data is DashboardUnversionedFields =>
    ('name' in data && !!data.name) ||
    ('spaceUuid' in data && !!data.spaceUuid);

export const isDashboardVersionedFields = (
    data: UpdateDashboard,
): data is DashboardVersionedFields => 'tiles' in data && !!data.tiles;

export const defaultTileSize = {
    h: 9,
    w: 15,
    x: 0,
    y: 0,
};

export const getDefaultChartTileSize = (
    chartType: SavedChartType | string | undefined,
) => {
    switch (chartType) {
        case 'big_number':
            return {
                h: 6,
                w: 9,
                x: 0,
                y: 0,
            };
        default:
            return defaultTileSize;
    }
};

export const hasChartsInDashboard = (dashboard: DashboardDAO) =>
    dashboard.tiles.some(
        (tile) =>
            isDashboardChartTileType(tile) &&
            tile.properties.belongsToDashboard,
    );

export type ApiGetDashboardsResponse = {
    status: 'ok';
    results: DashboardBasicDetailsWithTileTypes[];
};

export type ApiCreateDashboardResponse = {
    status: 'ok';
    results: Dashboard;
};

export type ApiUpdateDashboardsResponse = {
    status: 'ok';
    results: Dashboard[];
};

export type DuplicateDashboardParams = {
    dashboardName: string;
    dashboardDesc: string;
};

export function isDuplicateDashboardParams(
    params: DuplicateDashboardParams | CreateDashboard,
): params is DuplicateDashboardParams {
    return 'dashboardName' in params && 'dashboardDesc' in params;
}
