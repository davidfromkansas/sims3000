# Development workflow

The user requested GitHub synchronization and ongoing pull requests on 2026-09-12, then specified milestone-sized batches rather than frequent small commits.

- Repository: https://github.com/davidfromkansas/sims3000.git (local remote `github`).
- Group implementation into a meaningful step in playable functionality or a coherent improvement to an existing feedback milestone. Do not create a PR or publish for every small edit.
- Work on a descriptive `codex/` branch. Commit the coherent milestone, run relevant checks and browser verification where needed, then push the branch and create one PR describing player-visible behavior, validation and remaining limits.
- The user authorized creating, committing and merging these PRs as work continues. Merge after checks pass and any review findings are resolved. Do not request repeated merge approval. Preserve unrelated user changes and GitHub history.
- Synchronize local `main` with the merged GitHub state before the next milestone. Keep the Sites source repository and deployment aligned with the exact tested source when publishing a gameplay milestone. Keep source credentials out of files and Git configuration.
- Existing feedback milestones remain the organizing structure; incomplete manual requirements stay in scope. Player feedback is not assumed from silence.

The initial GitHub baseline imports the current project files and assets as one commit, preserving the repository’s initial commit. Earlier development history remains local and in the Sites repository because its author addresses are protected by GitHub email privacy. Use the configured GitHub no-reply address for new commits. Subsequent PRs should contain the incremental milestone only.

Hosting history remains on the local `sites-publication` branch. For a gameplay release, merge the verified GitHub `main` into that branch, confirm its tracked file tree matches GitHub `main`, and push it only to the existing Sites source repository before packaging/deploying. Return to GitHub `main` afterward. Never push `sites-publication` to GitHub: it retains the earlier private-email history. The first synchronization may require joining unrelated histories; preserve the current GitHub file tree and both histories.
