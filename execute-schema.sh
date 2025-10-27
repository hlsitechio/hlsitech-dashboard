#!/bin/bash

# Read SQL file and escape for JSON
SQL_CONTENT=$(cat "G:\hlsitechbusinesscard\dashboard\DATABASE_SCHEMA.sql" | sed 's/"/\\"/g' | tr '\n' ' ')

# Execute via Supabase Management API
curl -X POST "https://api.supabase.com/v1/projects/ggppnyylqpjqutzbdhmm/database/query" \
  -H "Authorization: Bearer sbp_92cc3fc10a6c84cebab2a5f8660f5c04a03211ee" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"${SQL_CONTENT}\"}"
