# PRD: MedusaJS v2 API Documentation & Shared Types Solution

## Executive Summary

This PRD outlines the implementation of a comprehensive API documentation and shared types solution for the camera store e-commerce platform, which consists of a MedusaJS v2 backend and Next.js frontend in a monorepo structure.

## Current State Analysis

### Backend API Structure
- **MedusaJS v2 Framework**: Version 2.8.8 with custom REST API endpoints
- **Custom API Endpoints**: 
  - Store API: `/store/category-products`, `/store/featured-categories`, `/store/category-facets`
  - Admin API: `/admin/categories/[id]/featured`, `/admin/custom`
- **Type Definitions**: Zod schemas for validation (e.g., `CategoryProductsSchema`)
- **Architecture**: File-based routing under `apps/backend/src/api/`

### Frontend Type Usage
- **Custom Types**: Defined in `apps/frontend/src/types/category.ts`
- **API Integration**: Direct HTTP calls to backend endpoints
- **Type Duplication**: Types are manually maintained in both frontend and backend

### Current Pain Points
1. **Type Drift**: Frontend and backend types can become out of sync
2. **Manual Maintenance**: API contracts must be manually updated in both projects
3. **No Live Documentation**: No interactive API documentation for development/testing
4. **Development Friction**: Changes require manual type updates across projects

## Solution Overview

Implement a three-tier approach:
1. **Shared Types Package** - Centralized type definitions
2. **Auto-Generated API Documentation** - Using MedusaJS v2 OpenAPI capabilities
3. **Development Workflow Integration** - Automated synchronization and validation

## Detailed Requirements

### 1. Shared Types Directory (`@camera-store/shared-types`)

**Objective**: Create a centralized directory for shared TypeScript type definitions.

**Technical Specifications**:
- **Location**: `shared-types/` (root level directory)
- **Build Strategy**: Pure TypeScript declarations - no build step required
- **Import Method**: TypeScript path mapping via `tsconfig.base.json`
- **Export Strategy**: Named exports with barrel files

**Type Categories**:
- **API Request/Response Types**: Request payloads, response schemas, pagination
- **Domain Models**: Product, Category, Customer, Order entities
- **Common Enums**: Status codes, sort options, filter types
- **Utility Types**: Generic pagination, error responses, metadata structures

**Example Structure**:
```
shared-types/
├── api/
│   ├── store/
│   │   ├── category-products.ts
│   │   ├── featured-categories.ts
│   │   └── index.ts
│   ├── admin/
│   └── index.ts
├── models/
│   ├── product.ts
│   ├── category.ts
│   └── index.ts
├── common/
│   ├── pagination.ts
│   ├── filters.ts
│   └── index.ts
└── index.ts
```

**Note**: No `package.json`, `tsconfig.json`, or `project.json` needed - just pure TypeScript type declarations.

### 2. OpenAPI Documentation Generation

**Objective**: Generate comprehensive, interactive API documentation using MedusaJS v2's OpenAPI capabilities.

**Technical Specifications**:
- **Tool**: `medusa-oas` CLI (experimental MedusaJS tool)
- **Documentation Format**: OpenAPI 3.1 specification
- **Viewer**: SwaggerUI integration
- **Custom Endpoints**: Support for project-specific API routes

**Implementation Steps**:
1. **Install Dependencies**:
   ```json
   {
     "devDependencies": {
       "@medusajs/medusa-oas": "latest",
       "swagger-inline": "latest"
     }
   }
   ```

2. **Swagger Inline Annotations**: Add OpenAPI comments to custom endpoints
   ```typescript
   /**
    * @swagger
    * /store/category-products:
    *   post:
    *     summary: Get products by category with filters
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CategoryProductsRequest'
    */
   ```

3. **Generation Script**: Automated OpenAPI spec generation
   ```bash
   npx medusa-oas --custom-endpoints ./src/api
   ```

### 3. Development Workflow Integration

**Objective**: Seamless integration with existing development workflow and CI/CD pipeline.

**Build Scripts Enhancement**:
```json
{
  "scripts": {
    "docs:generate": "npx medusa-oas --output docs/api-spec.yaml",
    "docs:serve": "swagger-ui-serve docs/api-spec.yaml",
    "validate:types": "nx run-many --targets=type-check --all"
  }
}
```

**Note**: No build script needed for shared-types since they're consumed directly as TypeScript source.

**GitHub Actions Integration**:
- **Type Validation**: Ensure shared types compile successfully
- **Documentation Generation**: Auto-generate OpenAPI specs on PR
- **Change Detection**: Flag API breaking changes

## Implementation Plan

### Phase 1: Shared Types Directory (Week 1-2)
1. **Setup Directory Structure**
   - Create `shared-types` directory at root level
   - Configure path mapping in `tsconfig.base.json`
   - Create barrel export files for each subdirectory

2. **Migrate Existing Types**
   - Extract types from `apps/frontend/src/types/category.ts`
   - Extract Zod schemas from backend API routes
   - Create shared type definitions

3. **Update Import References**
   - Replace local type imports with `@camera-store/shared-types` imports
   - Update backend API routes to use shared types
   - Update frontend components and hooks

### Phase 2: OpenAPI Documentation (Week 2-3)
1. **Install MedusaJS OAS Tooling**
   - Add `@medusajs/medusa-oas` to backend dependencies
   - Configure custom endpoint discovery

2. **Add Swagger Annotations**
   - Document existing custom API endpoints
   - Add request/response schemas
   - Include authentication requirements

3. **Setup Documentation Generation**
   - Create automated generation scripts
   - Setup SwaggerUI integration
   - Configure development server integration

### Phase 3: Workflow Integration (Week 3-4)
1. **Development Scripts**
   - Add type checking to build process
   - Create documentation generation commands
   - Setup local development server

2. **CI/CD Integration**
   - Add type validation to GitHub Actions
   - Setup automatic documentation updates
   - Implement breaking change detection

3. **Developer Documentation**
   - Create setup and usage guides
   - Document type sharing best practices
   - Provide migration examples

## Success Metrics

### Developer Experience
- **Reduced Setup Time**: < 5 minutes to get API documentation locally
- **Type Safety**: 100% shared type coverage for API endpoints
- **Documentation Accuracy**: Auto-generated docs always match implementation

### Code Quality
- **Type Consistency**: Zero type drift between frontend and backend
- **API Coverage**: 100% of custom endpoints documented
- **Breaking Change Detection**: Automatic detection and notification

### Maintenance Overhead
- **Manual Updates**: < 1 minute to update types after API changes
- **Documentation Maintenance**: Zero manual documentation updates required
- **Onboarding Time**: < 30 minutes for new developers to understand API structure

## Technical Considerations

### TypeScript Configuration

**Root `tsconfig.base.json`**:
```json
{
  "compilerOptions": {
    "paths": {
      "@camera-store/shared-types": ["shared-types/index.ts"]
    }
  }
}
```

**App TypeScript Configuration**:
- Frontend and backend apps automatically resolve shared types via path mapping
- No explicit references or workspace dependencies needed
- Types are consumed directly at compile time

### Import Strategy
```typescript
// In any backend or frontend file
import { CategoryProduct, ProductFilter } from '@camera-store/shared-types';
```

### Live Types Strategy
- **Development**: Direct TypeScript source consumption - no build step
- **Type Checking**: Handled by consuming apps during their compilation
- **IDE Support**: Full IntelliSense and type checking via path mapping

## Risk Assessment

### Low Risk
- **MedusaJS v2 Compatibility**: Stable OpenAPI tooling available
- **TypeScript Ecosystem**: Mature path mapping support
- **Simplified Architecture**: No build steps or package management needed

### Medium Risk
- **Breaking Changes**: API modifications require careful coordination
- **Learning Curve**: Team familiarity with OpenAPI specifications

### Mitigation Strategies
- **Gradual Migration**: Implement types incrementally
- **Comprehensive Testing**: Type checking in CI/CD pipeline  
- **Documentation**: Clear migration guides and best practices
- **Simple Structure**: Pure TypeScript declarations reduce complexity

## Future Enhancements

### Phase 2+ Features
- **SDK Generation**: Auto-generated TypeScript SDK for API consumption
- **Mock Server**: OpenAPI-based mock server for frontend development
- **API Versioning**: Support for multiple API versions
- **Integration Testing**: Contract testing between frontend and backend

### Advanced Tooling
- **IDE Extensions**: Custom VS Code extensions for API exploration
- **Postman Integration**: Auto-sync with Postman collections
- **GraphQL Schema**: Integration with MedusaJS GraphQL capabilities

## Conclusion

This comprehensive solution addresses the current pain points while establishing a foundation for scalable API documentation and type safety. The implementation leverages existing tools and follows industry best practices for monorepo management, ensuring long-term maintainability and developer productivity.

The phased approach minimizes disruption to current development workflows while delivering incremental value throughout the implementation process.