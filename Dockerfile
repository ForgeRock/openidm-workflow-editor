# Copyright (c) 2020-2021 ForgeRock. All rights reserved.
#
# This software may be modified and distributed under the terms
# of the MIT license. See the LICENSE file for details.

ARG BASE_TAG
FROM nginx-unprivileged-headers-more:0c322c8

COPY --chown=nginx dist /usr/share/nginx/html

COPY --chown=nginx variable_replacement.sh /variable_replacement.sh
COPY --chown=nginx entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]
