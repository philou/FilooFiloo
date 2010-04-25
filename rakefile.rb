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

require 'rake'
require 'rake/clean'
require 'erb'

IMAGE_DIRECTORY = "apps/filoo_filoo/resources/images"
POV_SETTINGS = IMAGE_DIRECTORY + "/sprites.ini"

COLORS = { 
  "red" => "<0.6,0,0>",
  "green" => "<0,0.6,0>",
  "blue" => "<0,0,0.6>",
  "purple" => "<0.6,0,0.6>",
  "yellow" => "<0.6,0.6,0>",
  "grey" => "<0.6,0.6,0.6>"
}

def colors_regex_text()
  "(#{COLORS.keys.join("|")})"
end

def sprites_files_regex(extension)
  Regexp.new("sprites_#{colors_regex_text()}\.#{extension}$")
end

## tasks
directory IMAGE_DIRECTORY

rule sprites_files_regex("pov") => [ IMAGE_DIRECTORY ] do |t|

  if not (t.name =~ Regexp.new(colors_regex_text()))
    raise "Unrecognized source file #{t.name}"
  end
  color = $&
  
  povTemplate = ERB.new <<-EOF
camera {
  location    <0.0, 0.0, -10.0>
  direction 10*x
  sky         y
  up          2*y
  right       -2*x
  look_at     <0, 0, 0>
  //angle       40
}

light_source {
  <-1, 2, -1.5>*100000
  color rgb <1, 1, 1>
}

background { color rgbf<1,1,1, 1> }

#declare Threshold=0.4;
#declare Radius=1.5;
#declare Strength=1;
#declare Color= rgb<%= COLORS[color]%>;
#declare Top=0;
#declare Right=0;
#declare Down=0;
#declare Left=0;

object {
	blob {
		threshold Threshold
		sphere { <0.0, 0.0, 0.0>, Radius, Strength }
		#if (Top)
			sphere { <0.0, 2.0, 0.0>, Radius, Strength }
		#end
		#if (Right)
			sphere { <-2.0, 0.0, 0.0>, Radius, Strength }
		#end
		#if (Left)
			sphere { <2.0, 0.0, 0.0>, Radius, Strength }
		#end
		#if (Down)
			sphere { <0.0, -2.0, 0.0>, Radius, Strength }
		#end
		
		texture {
			pigment {
				color Color
			}
			finish {reflection 0.2 brilliance 0.0 phong 0.3 phong_size 1.0 specular 1 roughness 0.005}
		}
		/*texture {
			pigment {aoi color_map {[1.0 rgbf <1,1,1,1>][0.3 rgb 0.0]}}
		} */
	}
}
  EOF

  File.open(t.name, "w") do |n|
    n.write(povTemplate.result(binding))
  end
end

file POV_SETTINGS => [IMAGE_DIRECTORY] do |t|
  povTemplate = ERB.new <<-EOF
Width=30
Height=30
Output_Alpha=On
Output_File_Type=n
Output_To_File=On
  EOF

  File.open(POV_SETTINGS, "w") do |n|
    n.write(povTemplate.result(binding))
  end
end

def image_source(image_file)
  image_file.sub(".png",".pov")
end

rule sprites_files_regex("png") => [ proc { |tn| image_source(tn) }, POV_SETTINGS ] do |t|
  sh "povray #{POV_SETTINGS} +A +I#{image_source(t.name)} +O#{t.name}"
end

def sprites_files()
  result = []
  COLORS.each_key do |color|
    result.push("#{IMAGE_DIRECTORY}/sprites_#{color}.png")
  end
  result
end

task :sprites => sprites_files()

CLOBBER.include(POV_SETTINGS)
COLORS.each_key do |color|
  CLOBBER.include("#{IMAGE_DIRECTORY}/sprites_#{color}.pov")
  CLEAN.include("#{IMAGE_DIRECTORY}/sprites_#{color}.png")
end
