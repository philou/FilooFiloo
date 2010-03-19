# ===========================================================================
# Project:   FilooFiloo-1.0
# Copyright: ©2008-2009 Philippe Bourgau, Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the MIT License.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the MIT
# License for more details.
#
# You should have received a copy of the MIT License along with this
# program. If not, see <http://www.opensource.org/licenses/mit-license.php>
#
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore

proxy "/high_scores", :to => "localhost:4567"
proxy "/players", :to => "localhost:4567"
# add other records here