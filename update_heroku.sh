#!//bin/bash

HEROKU_DIR="${1:-/$HOME/pmd/people-making-a-difference/}"

# Rsync to heroku directory
rsync -av --exclude={'.git','node_modules','uploads'} Backend/ ${HEROKU_DIR}

# Diff after sync
diff -r -x .git -x node_modules -x uploads Backend/ ${HEROKU_DIR}

