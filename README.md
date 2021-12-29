# ReactJS gallery action

![](https://github.com/botamochi6277/reactjs-gallery-action/actions/workflows/build.yml/badge.svg)
![](https://github.com/botamochi6277/reactjs-gallery-action/actions/workflows/pages.yml/badge.svg)

A github action to deploy pages of gallery
This action requires following two arguments.
However, please keep these in default value for rendering.

- `dir`: directory path containing image files
- `filename`: filename to save image list.

[Sample Pages](https://botamochi6277.github.io/reactjs-gallery-action/)

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
