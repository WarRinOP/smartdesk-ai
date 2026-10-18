-- SmartDesk: turn on row level security for the app tables. The app reaches them
-- only through server routes using the service role key, so no public policies.
alter table knowledge_chunks enable row level security;
alter table conversations enable row level security;
alter table bot_config enable row level security;
revoke execute on function match_chunks(vector, int, float) from public, anon, authenticated;
grant execute on function match_chunks(vector, int, float) to service_role;
