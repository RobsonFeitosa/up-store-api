 
### Migration commands1
  - RUN its - yarn typeorm -- -d ./src/shared/infra/typeorm migration:run
  - REVERT - yarn typeorm -- -d ./src/shared/infra/typeorm migration:revert
  - CREATE - yarn typeorm migration:create src/shared/infra/typeorm/migrations/NEWMIGRATION
  - SCHEMA DROP - yarn typeorm -- -d src/shared/infra/typeorm schema:drop
 