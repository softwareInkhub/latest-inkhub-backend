export interface Schema {
    uuid: string;
    schemaName: string;
    schema: string;
    tableRef?: string;
    isTableInitialized?: boolean;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface SchemaProperty {
    type: string;
    description?: string;
    format?: string;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    enum?: any[];
    items?: SchemaProperty;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
    readOnly?: boolean;
    default?: any;
}

export interface SchemaDefinition {
    type: string;
    properties: Record<string, SchemaProperty>;
    required?: string[];
    additionalProperties?: boolean;
} 