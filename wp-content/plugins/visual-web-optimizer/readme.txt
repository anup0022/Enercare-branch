=== Visual Website Optimizer ===
Contributors: VWO
Plugin Name: VWO
Plugin URI: https://vwo.com/
Tags: split testing, analytics, stats, visual web optimizer, vwo, cro
Requires at least: 2.7
Tested up to: 6.4.1
Stable tag: 4.1

VWO is the all-in-one platform that helps you conduct visitor research, build an optimization roadmap, and run continuous experimentation. 

== Description ==
This plugin will allow you to automatically insert the VWO tracking code. Just enter your VWO Account ID from https://app.vwo.com/#/settings

== Installation ==
Wordpress : Extract the zip file and just drop the contents in the wp-content/plugins/ directory of your WordPress installation and then activate the Plugin from Plugins page.

WordpressMu : Same as above 

== Frequently Asked Questions ==
= I can't see any code added to my header or footer when I view my page source =
Your theme needs to have the header and footer actions in place before the `</head>` and before the `</body>`

= If I use this plugin, do I need to enter any other code on my website? =
No, this plugin is sufficient by itself

== Screenshots ==
1. Settings page (Asynchronous Code)
2. Settings page (Synchronous Code)

== ChangeLog ==
= 4.1 =
* Tested with latest version
* PHPCS Errors resolved
* WP Rocket support added

= 4.0 =
* Tested with latest version
* VWO SmartCode updated

= 3.9 =
* Tested with latest version
* Code improvement and add Rocket loader handling

= 3.8 =
* Tested with latest version
* Fix WP Rocket Issue

= 3.7 =
* Tested with latest version
* Fix Divi Frontend Editor Issue

= 3.6 =
* Tested with latest version

= 3.5 =
* Tested with latest version
* Rename label "Handle Rocket Loader Issue" to "Skip Deferred Execution"
* Set field default value of "Skip Deferred Execution" to "yes"

= 3.4 =
* Tested with latest version
* Code improvement and add Rocket loader handling

= 3.3 =
* Tested with latest version
* Add new options in settings

= 3.2 =
* Tested with latest version

= 3.1 =
* Add Setting link in plugin listing page

= 3.0 =
* Update Logo and links

= 2.9 =
* Tested with latest version

= 2.8 =
* Tested with latest version

= 2.7 =
* Update Plugin Name, Author and Description

= 2.6 =
* Remove Conflict Errors

= 2.5 =
* Update tested upto version

= 2.4 =
* Update links

= 2.3 =
* Minor bug fix

= 2.2 =
* Bug fix to have default tolerance values when plugin is updated

= 2.1 =
* Better documentation

= 2.0 =
* Option to choose between asynchronous or synchronous code
* Updated code snippet
* Faster website loading

= 1.3 =
* code snippet updated

= 1.0.1 =
* use Website instead of Web in name of functions and readme (branding)

= 1.0 =
* First Version

== Upgrade Notice ==
Option to choose the new asynchronous code. This will make the website load faster

== Configuration ==

Enter your ID in the field marked 'YOUR VWO ACCOUNT ID'

== Adding to your template ==

header code :
`<?php wp_head();?>`

footer code : 
`<?php wp_footer();?>`