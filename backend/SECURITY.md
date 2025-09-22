Security guidance for MedixScan backend
=====================================

Immediate steps after a secret exposure
---------------------------------------
1. Rotate the exposed key immediately via the provider's dashboard (e.g., OpenAI).
2. Revoke the compromised key and generate a new one.
3. Remove any copies of the key from the repository history (use `git filter-repo` or contact your Git host support).
4. Store new keys in a secrets manager (Railway secrets, GitHub Actions secrets, AWS Secrets Manager, etc.) and inject them into runtime via environment variables.

Local developer steps
---------------------
- Never store production secrets in `.env` files that are committed. Use `.env.local` for local development and ensure `.gitignore` excludes it.
- Use `backend/.env.example` as the template for required environment variables.

Recommended long-term actions
-----------------------------
- Implement automated secret scanning in CI (e.g., truffleHog, detect-secrets, GitGuardian).
- Use per-environment secrets with least privilege.
- Rotate keys periodically and monitor usage logs for anomalies.

Contact / Incident
------------------
If you believe sensitive patient data was exposed, follow your organization's incident response and legal requirements immediately; this document does not substitute for legal or compliance advice.
