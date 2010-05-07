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
#declare Color= rgb<0,0,0.6>;
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
