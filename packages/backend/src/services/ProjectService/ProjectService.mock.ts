import { Ability } from '@casl/ability';
import {
    Account,
    AccountUser,
    ApiQueryResults,
    ChartKind,
    ChartType,
    DbtProjectType,
    DefaultSupportedDbtVersion,
    DimensionType,
    Explore,
    ExploreError,
    ExploreType,
    FieldType,
    Job,
    JobLabels,
    JobStatusType,
    JobStepStatusType,
    JobStepType,
    JobType,
    LightdashSessionUser,
    MetricQuery,
    MetricType,
    OrganizationMemberRole,
    OrganizationProject,
    PossibleAbilities,
    Project,
    ProjectSummary,
    ProjectType,
    ResultColumns,
    SessionUser,
    Space,
    SummaryExplore,
    SupportedDbtAdapter,
    TablesConfiguration,
    TableSelectionType,
    WarehouseClient,
    WarehouseTypes,
} from '@lightdash/common';
import { LightdashConfig } from '../../config/parseConfig';
import { projectUuid } from '../../models/ProjectModel/ProjectModel.mock';

const userId = 'userId';

export const user: SessionUser = {
    userUuid: userId,
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    isTrackingAnonymized: false,
    isMarketingOptedIn: false,
    isSetupComplete: true,
    userId: 0,
    role: OrganizationMemberRole.ADMIN,
    ability: new Ability<PossibleAbilities>([
        { subject: 'Project', action: ['update', 'view'] },
        { subject: 'Job', action: ['view'] },
        { subject: 'SqlRunner', action: ['manage'] },
        { subject: 'Explore', action: ['manage'] },
    ]),
    isActive: true,
    abilityRules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const buildAccount = ({
    accountType = 'session',
    userType = 'registered',
}: {
    accountType?: Account['authentication']['type'];
    userType?: AccountUser['type'];
} = {}) =>
    ({
        user: {
            ...user,
            id: userId,
            type: userType,
        },
        organization: {
            organizationUuid: 'organizationUuid',
            createdAt: new Date(),
            name: 'organizationName',
        },
        authentication: {
            type: accountType,
        },
        isSessionUser: () => accountType === 'session',
        isRegisteredUser: () => userType === 'registered',
        isJwtUser: () => accountType === 'jwt',
        isAnonymousUser: () => userType === 'anonymous',
    } as unknown as Account);

export const validExplore: Explore = {
    targetDatabase: SupportedDbtAdapter.POSTGRES,
    name: 'valid_explore',
    label: 'valid_explore',
    tags: [],
    baseTable: 'a',
    type: ExploreType.DEFAULT,
    joinedTables: [
        {
            sqlOn: '${a.dim1} = ${b.dim1}',
            table: 'b',
            compiledSqlOn: '("a".dim1) = ("b".dim1)',
            type: undefined,
        },
    ],
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: '',
                    sql: '',
                    hidden: false,
                    compiledSql: '',
                    tablesReferences: ['a'],
                },
            },
            metrics: {
                met1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.STRING,
                    name: 'met1',
                    label: 'met1',
                    table: 'a',
                    tableLabel: '',
                    sql: '',
                    hidden: false,
                    compiledSql: '',
                    tablesReferences: ['a'],
                },
            },
            lineageGraph: {},
        },
        b: {
            name: 'b',
            label: 'b',
            database: 'database',
            schema: 'schema',
            sqlTable: 'public.b',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'b',
                    tableLabel: '',
                    sql: '',
                    hidden: false,
                    compiledSql: '',
                    tablesReferences: ['b'],
                },
            },
            metrics: {},
            lineageGraph: {},
        },
    },
};

export const exploreWithError: ExploreError = {
    name: 'error',
    label: 'error',
    errors: [],
};

export const exploreWithTags: ExploreError = {
    ...exploreWithError,
    tags: ['tag_name', 'another_tag'],
};

export const exploreWithMetrics: Explore = {
    ...validExplore,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {
                myMetric: {
                    table: 'a',
                    tableLabel: 'a',
                    sql: 'sql',
                    name: 'myMetric',
                    label: 'myMetric',
                    fieldType: FieldType.METRIC,
                    type: MetricType.NUMBER,
                    compiledSql: 'compiledSql',
                    tablesReferences: undefined,
                    hidden: false,
                },
            },
            lineageGraph: {},
        },
    },
};

export const allExplores = [validExplore, exploreWithError, exploreWithTags];

export const expectedAllExploreSummary: SummaryExplore[] = [
    {
        name: validExplore.name,
        label: validExplore.label,
        tags: validExplore.tags,
        databaseName: validExplore.tables[validExplore.baseTable].database,
        schemaName: validExplore.tables[validExplore.baseTable].schema,
        description: validExplore.tables[validExplore.baseTable].description,
        type: ExploreType.DEFAULT,
    },
    {
        name: exploreWithError.name,
        label: exploreWithError.label,
        errors: exploreWithError.errors,
    },
    {
        name: exploreWithTags.name,
        label: exploreWithTags.label,
        tags: exploreWithTags.tags,
        errors: exploreWithTags.errors,
    },
];

export const expectedExploreSummaryFilteredByTags = [
    expectedAllExploreSummary[2],
];
export const expectedExploreSummaryFilteredByName = [
    expectedAllExploreSummary[0],
];

export const expectedAllExploreSummaryWithoutErrors = [
    expectedAllExploreSummary[0],
];

export const tablesConfiguration: TablesConfiguration = {
    tableSelection: {
        type: TableSelectionType.ALL,
        value: null,
    },
};

export const tablesConfigurationWithTags: TablesConfiguration = {
    tableSelection: {
        type: TableSelectionType.WITH_TAGS,
        value: [exploreWithTags.tags![0]],
    },
};

export const tablesConfigurationWithNames: TablesConfiguration = {
    tableSelection: {
        type: TableSelectionType.WITH_NAMES,
        value: [validExplore.name],
    },
};

export const expectedCatalog = {
    database: {
        schema: {
            a: {
                description: undefined,
                sqlTable: 'test.table',
            },
            b: {
                description: undefined,
                sqlTable: 'public.b',
            },
        },
    },
};

export const sessionAccount = buildAccount();

export const projectWithSensitiveFields: Project = {
    organizationUuid: sessionAccount.organization.organizationUuid!,
    projectUuid: 'projectUuid',
    name: 'name',
    type: ProjectType.DEFAULT,
    dbtVersion: DefaultSupportedDbtVersion,
    dbtConnection: {
        type: DbtProjectType.DBT_CLOUD_IDE,
        api_key: 'api_key',
        environment_id: 'environment_id',
    },
    schedulerTimezone: 'UTC',
    createdByUserUuid: sessionAccount.user.id,
};

export const projectSummary: ProjectSummary = {
    organizationUuid: sessionAccount.organization.organizationUuid!,
    projectUuid: 'projectUuid',
    name: 'name',
    type: ProjectType.DEFAULT,
};
export const defaultProject: OrganizationProject = {
    projectUuid: 'projectUuid',
    name: 'name',
    type: ProjectType.DEFAULT,
    createdByUserUuid: sessionAccount.user.id,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    upstreamProjectUuid: null,
    warehouseType: WarehouseTypes.POSTGRES,
    requireUserCredentials: false,
};

export const spacesWithSavedCharts: Space[] = [
    {
        organizationUuid: sessionAccount.organization.organizationUuid!,
        name: 'space',
        slug: 'space',
        parentSpaceUuid: null,
        path: 'space',

        isPrivate: false,
        uuid: 'uuid',
        pinnedListUuid: null,
        pinnedListOrder: null,
        queries: [
            {
                uuid: 'savedChartUuid',
                name: 'saved chart name',
                updatedAt: new Date(),
                spaceUuid: 'uuid',
                pinnedListUuid: null,
                pinnedListOrder: null,
                chartType: ChartType.CARTESIAN,
                chartKind: ChartKind.AREA,
                views: 1,
                firstViewedAt: new Date(),
                dashboardName: 'dashboardName',
                dashboardUuid: 'dashboardUuid',
                projectUuid: 'projectUuid',
                spaceName: 'spaceName',
                organizationUuid: 'organizationUuid',
                slug: 'saved-chart-name',
            },
        ],
        projectUuid,
        dashboards: [],
        childSpaces: [],
        access: [],
        groupsAccess: [],
    },
];

export const spacesWithNoSavedCharts: Space[] = [
    {
        organizationUuid: sessionAccount.organization.organizationUuid!,
        name: 'space',
        slug: 'space',
        parentSpaceUuid: null,
        path: 'space',

        uuid: 'uuid',
        pinnedListUuid: null,
        pinnedListOrder: null,
        queries: [],
        projectUuid,
        isPrivate: false,
        dashboards: [],
        access: [],
        groupsAccess: [],
        childSpaces: [],
    },
];

export const job: Job = {
    jobUuid: 'jobUuid',
    projectUuid: 'projectUuid',
    userUuid: sessionAccount.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    jobStatus: JobStatusType.DONE,
    jobType: JobType.COMPILE_PROJECT,
    steps: [
        {
            jobUuid: 'jobUuid',
            createdAt: new Date(),
            updatedAt: new Date(),
            stepStatus: JobStepStatusType.DONE,
            stepType: JobStepType.COMPILING,
            stepError: undefined,
            stepDbtLogs: undefined,
            stepLabel: JobLabels[JobStepType.COMPILING],
            startedAt: new Date(),
        },
    ],
};

export const jobError: Job = {
    jobUuid: 'jobUuid',
    projectUuid: 'projectUuid',
    userUuid: sessionAccount.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    jobStatus: JobStatusType.ERROR,
    jobType: JobType.COMPILE_PROJECT,
    steps: [
        {
            jobUuid: 'jobUuid',
            createdAt: new Date(),
            updatedAt: new Date(),
            stepStatus: JobStepStatusType.ERROR,
            stepType: JobStepType.COMPILING,
            stepError: 'Detailed error message',
            stepDbtLogs: undefined,
            stepLabel: JobLabels[JobStepType.COMPILING],
            startedAt: new Date(),
        },
    ],
};

export const lightdashConfigWithNoSMTP: Pick<
    LightdashConfig,
    'smtp' | 'siteUrl' | 'query'
> = {
    smtp: undefined,
    siteUrl: 'https://test.lightdash.cloud',
    query: {
        maxPageSize: 500,
        maxLimit: 100,
        defaultLimit: 500,
        csvCellsLimit: 100,
        timezone: undefined,
        showQueryWarnings: false,
    },
};

export const metricQueryMock: MetricQuery = {
    exploreName: validExplore.name,
    filters: {},
    limit: 501,
    dimensions: ['a_dim1'],
    metrics: ['a_met1'],
    sorts: [],
    tableCalculations: [
        {
            name: 'tc',
            displayName: '',
            sql: '',
        },
    ],
};

export const resultsWith1Row: Awaited<ReturnType<WarehouseClient['runQuery']>> =
    {
        fields: {
            a_dim1: { type: DimensionType.STRING },
            a_met1: { type: DimensionType.STRING },
            tc: { type: DimensionType.NUMBER },
        },
        rows: [{ a_dim1: 'val1', a_met1: 'val2', tc: 1 }],
    };

export const resultsWith501Rows: Awaited<
    ReturnType<WarehouseClient['runQuery']>
> = {
    ...resultsWith1Row,
    rows: Array(501).map(() => ({ a_dim1: 'val1', a_met1: 'val2', tc: 1 })),
};

export const expectedFormattedRow = {
    a_dim1: {
        value: {
            formatted: 'val1',
            raw: 'val1',
        },
    },
    a_met1: {
        value: {
            formatted: 'val2',
            raw: 'val2',
        },
    },
    tc: {
        value: {
            formatted: '1',
            raw: 1,
        },
    },
};

export const expectedColumns: ResultColumns = {
    dim1: {
        reference: 'dim1',
        type: DimensionType.STRING,
    },
};

export const expectedApiQueryResultsWith1Row: ApiQueryResults = {
    cacheMetadata: {
        cacheHit: false,
    },
    fields: {
        a_dim1: validExplore.tables.a.dimensions.dim1,
        a_met1: validExplore.tables.a.metrics.met1,
        tc: metricQueryMock.tableCalculations[0],
    },
    metricQuery: metricQueryMock,
    rows: [expectedFormattedRow],
};

export const expectedApiQueryResultsWith501Rows: ApiQueryResults = {
    cacheMetadata: {
        cacheHit: false,
    },
    fields: {
        a_dim1: validExplore.tables.a.dimensions.dim1,
        a_met1: validExplore.tables.a.metrics.met1,
        tc: metricQueryMock.tableCalculations[0],
    },
    metricQuery: metricQueryMock,
    rows: Array(501).map(() => expectedFormattedRow),
};
