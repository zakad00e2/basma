<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Catalog, brand info and UI strings live in src/data/*.ts; edit there (no admin panel yet) so a future admin/DB can replace them.
- Cart, favorites and language persist in localStorage via src/lib/store.tsx; this is not an order system.
- The opening screen is src/components/Intro.tsx and its timings are mirrored in the .intro rules in src/styles.css; keep both in sync so it always fades out instead of freezing, and keep it running once per full page load rather than on in-app navigation.
