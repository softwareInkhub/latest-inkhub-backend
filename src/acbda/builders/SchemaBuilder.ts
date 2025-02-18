import { Schema } from '../../types';

export class SchemaBuilder {
    private schemaDefinition: {
        type: string;
        properties: Record<string, any>;
        required: string[];
        additionalProperties?: boolean;
    };
    private uuid: string;
    private schemaName: string;
    private createdAt: string;
    private lastUpdatedAt: string;

    constructor(uuid: string, schemaName: string) {
        this.uuid = uuid;
        this.schemaName = schemaName;
        this.createdAt = new Date().toISOString();
        this.lastUpdatedAt = this.createdAt;
        this.schemaDefinition = {
            type: 'object',
            properties: {
                'schema-id': {
                    type: 'string',
                    description: 'Reference to the schema definition',
                    readOnly: true,
                    default: this.uuid
                }
            },
            required: ['schema-id']
        };
    }

    addProperties(properties: Record<string, any>) {
        // Preserve schema-id while adding new properties
        this.schemaDefinition.properties = {
            'schema-id': this.schemaDefinition.properties['schema-id'],
            ...properties
        };
        return this;
    }

    addRequired(fields: string[]) {
        // Ensure schema-id remains in required fields
        const uniqueRequired = new Set(['schema-id', ...fields]);
        this.schemaDefinition.required = Array.from(uniqueRequired);
        return this;
    }

    setAdditionalProperties(allowed: boolean) {
        this.schemaDefinition.additionalProperties = allowed;
        return this;
    }

    build(): Schema {
        return {
            uuid: this.uuid,
            schemaName: this.schemaName,
            schema: JSON.stringify(this.schemaDefinition),
            createdAt: this.createdAt,
            lastUpdatedAt: this.lastUpdatedAt
        };
    }

    static fromExisting(existingSchema: Schema) {
        const builder = new SchemaBuilder(existingSchema.uuid, existingSchema.schemaName);
        const parsedSchema = JSON.parse(existingSchema.schema);
        
        // Ensure schema-id is preserved
        builder.schemaDefinition = {
            ...parsedSchema,
            properties: {
                'schema-id': {
                    type: 'string',
                    description: 'Reference to the schema definition',
                    readOnly: true,
                    default: existingSchema.uuid
                },
                ...parsedSchema.properties
            },
            required: Array.from(new Set(['schema-id', ...(parsedSchema.required || [])]))
        };
        
        builder.createdAt = existingSchema.createdAt;
        builder.lastUpdatedAt = new Date().toISOString();
        return builder;
    }

    static validateSchema(schemaData: string | any) {
        const parsedSchema = typeof schemaData === 'string'
            ? JSON.parse(schemaData)
            : schemaData;

        if (!parsedSchema.type || parsedSchema.type !== 'object') {
            throw new Error('Schema must be of type "object"');
        }

        // Ensure schema-id is not manually added/modified
        if (parsedSchema.properties && 'schema-id' in parsedSchema.properties) {
            delete parsedSchema.properties['schema-id'];
        }

        if (!parsedSchema.properties) {
            parsedSchema.properties = {};
        }

        return parsedSchema;
    }
} 