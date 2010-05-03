# ===========================================================================
# Project:   FilooFiloo-1.0
# Copyright: ©2008-2009 Philippe Bourgau, Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>
#
# ===========================================================================

#This file was copied from aux3marcassins

require 'net/ftp'

def verbose(caption) 
  begin
    puts caption
    yield
  rescue
    puts $!
  end
end

def puttextfile(ftp, local, remote)
  verbose("uploading file #{remote}") { ftp.puttextfile(local, remote) }
end

def putbinaryfile(ftp, local, remote)
  verbose("uploading file #{remote}") { ftp.putbinaryfile(local, remote) }
end

def mkdir(ftp, remote)
  verbose("creating dir #{remote}") { ftp.mkdir(remote) }
end

def uploadHierarchy(ftp, ldir, rdir, txtExts)
  mkdir(ftp, rdir)
  Dir.foreach(ldir) do |file|
    if (file != '.' && file != '..')
      lfile = File.join(ldir, file)
      rfile = File.join(rdir, file)
      if File.directory?(lfile)
        uploadHierarchy(ftp, lfile, rfile, txtExts)
      else
        if txtExts.include?(File.extname(file))
          puttextfile(ftp, lfile, rfile)
        else
          putbinaryfile(ftp, lfile, rfile)
        end
      end
    end
  end
end
