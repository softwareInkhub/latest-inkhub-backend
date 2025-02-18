"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaBuilder = void 0;
class SchemaBuilder {
    constructor(uuid, schemaName) {
        this.uuid = uuid;
        this.schemaName = schemaName;
        this.createdAt = new Date().toISOString();
        this.lastUpdatedAt = this.createdAt;
        this.schemaDefinition = {
            type: 'object',
            properties: {},
            required: []
        };
    }
    addSystemFields() {
        // Add schema-id as a system field
        this.schemaDefinition.properties['schema-id'] = {
            type: 'string',
            description: 'Reference to the schema definition',
            readOnly: true,
            default: this.uuid
        };
        // Add system fields to required
        if (!this.schemaDefinition.required) {
            this.schemaDefinition.required = [];
        }
        if (!this.schemaDefinition.required.includes('schema-id')) {
            this.schemaDefinition.required.push('schema-id');
        }
    }
    addProperties(properties) {
        this.schemaDefinition.properties = Object.assign(Object.assign({}, this.schemaDefinition.properties), properties);
        return this;
    }
    addRequired(fields) {
        if (!this.schemaDefinition.required) {
            this.schemaDefinition.required = [];
        }
        this.schemaDefinition.required.push(...fields);
        return this;
    }
    setAdditionalProperties(allowed) {
        this.schemaDefinition.additionalProperties = allowed;
        return this;
    }
    build() {
        // Add system fields before building
        this.addSystemFields();
        return {
            uuid: this.uuid,
            schemaName: this.schemaName,
            schema: JSON.stringify(this.schemaDefinition),
            createdAt: this.createdAt,
            lastUpdatedAt: this.lastUpdatedAt
        };
    }
    static fromExisting(existingSchema) {
        const builder = new SchemaBuilder(existingSchema.uuid, existingSchema.schemaName);
        builder.schemaDefinition = JSON.parse(existingSchema.schema);
        builder.createdAt = existingSchema.createdAt;
        builder.lastUpdatedAt = new Date().toISOString();
        return builder;
    }
    static validateSchema(schemaData) {
        const parsedSchema = typeof schemaData === 'string'
            ? JSON.parse(schemaData)
            : schemaData;
        if (!parsedSchema.type || parsedSchema.type !== 'object') {
            throw new Error('Schema must be of type "object"');
        }
        if (!parsedSchema.properties) {
            parsedSchema.properties = {};
        }
        return parsedSchema;
    }
}
exports.SchemaBuilder = SchemaBuilder;
