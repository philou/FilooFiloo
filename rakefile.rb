require 'rake'
require 'erb'

$image_directory = "clients/puyo_puyo/english.lproj/images"
$pov_source = $image_directory + "/sprites.pov"
$pov_settings = $image_directory + "/sprites.ini"

def color(name, value)
  { :name => name, :value => value }
end

$colors = [color("red", "<0.6,0,0>"),
           color("green", "<0,0.6,0>"),
           color("blue", "<0,0,0.6>"),
           color("purple", "<0.6,0,0.6>"),
           color("yellow", "<0.6,0.6,0>")]

def color_index(name)
  $colors.each_index do |i|
    if ($colors[i][:name] == name)
      return i+1
    end
  end
  -1
end

def colors_regex_text()
  first = true
  result = '('
  $colors.each do |color|
    if not first
      result = result + '|'
    end
    first = false
    result = result + color[:name]
  end
  result = result + ')'
  result
end

$sprites_files_regex = Regexp.new("sprites_" + colors_regex_text() + "\.png$")
$colors_regex = Regexp.new(colors_regex_text())

def sprites_files()
  result = []
  $colors.each do |color|
    result.push("#{$image_directory}/sprites_#{color[:name]}.png")
  end
  result
end

## tasks
directory $image_directory

file $pov_source => [$image_directory] do |t|

  povTemplate = ERB.new <<-EOF
#version unofficial megapov 1.1;

#if (!clock_on)
  #debug "This scene should be rendered as an animation with 1 -> <%= $colors.length %> frames\\n"
#end

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
#declare Variant = frame_number - 1;
#switch (Variant)
<% i=0; while (i < $colors.length) %>
	#case (<%= i %>)
		#declare Color= rgb<%= $colors[i][:value]%>;
		#declare Top=0;
		#declare Right=0;
		#declare Down=0;
		#declare Left=0;
	#break
<%    i = i+1 %>
<% end %>
#end



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
		texture {
			pigment {aoi color_map {[1.0 rgbf <1,1,1,1>][0.3 rgb 0.0]}}
		} 
	}
}
  EOF

  File.open($pov_source, "w") do |n|
    n.write(povTemplate.result(binding))
  end
end

file $pov_settings => [$image_directory] do |t|
  povTemplate = ERB.new <<-EOF
Width=30
Height=30
Initial_Frame=1
Final_Frame=<%= $colors.length %>
Output_Alpha=On
Output_File_Type=n
Output_To_File=On
  EOF

  File.open($pov_settings, "w") do |n|
    n.write(povTemplate.result(binding))
  end
end

task :pov_source => [$pov_source, $pov_settings]

rule( $sprites_files_regex => [ proc do |task_name|
                                 if task_name =~ $colors_regex
                                   task_name.sub('_' + $&, color_index($&).to_s)
                                 end
                               end ]) do |t|
  sh "cp #{t.source} #{t.name}"
end

task :sprites => sprites_files()

