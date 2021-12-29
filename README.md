# ReactJS gallery action

A github action to deploy pages of gallery
This action requires following two arguments.

- `dir`: directory path containing image files
- `outpath`

## Example

```yaml
name: Build Reactjs and Deploy on Pages
on:
  push:
    branches: [main]
jobs:
  build_vue:
    runs-on: ubuntu-latest
    name: Build Reactjs
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2
      - id: Build-Reactjs
        uses: botamochi6277/reactjs-gallery-action@main
        with:
          dir: 'imgs'
          filename: '.'
      - name: git setting
        run: |
          git config --local user.email "action_runner@users.noreply.github.com"
          git config --local user.name "action runner"
      - name: Commit and push files
        run: |
          git checkout -b gh-pages
          git add .
          git commit -m "build pages" -a
          git push origin HEAD:gh-pages --force
```
