export const roads_hierarchy = [
  // Major highways
  "motorway",
  "motorway_link",
  "trunk",
  "trunk_link",

  // Arterial roads
  "primary",
  "primary_link",
  "secondary",
  "secondary_link",
  "tertiary",
  "tertiary_link",

  // Local roads
  "unclassified",
  "residential",

  // other smaller roads for vehicles
  "living_street",
  "service",
  "track",
  "road", // yet unqualified road
  "busway",
  "bus_guideway",
  "raceway",
  "escape",

  // not for vehicles, to be rendered as dotted lines
  "footway", "path", "cycleway", "steps", 'pedestrian', 'bridleway', 'corridor'
]
/* 
  ****
  'construction' type is not included. It's temporary and I tend not to include temporary things
*/


export const roads_common_config = {
  motorway: 0,
  secondary: 13.5,
  tertiary: 14.2,
  unclassified: 15,
  living_street: 16,
  footway: 16,
}