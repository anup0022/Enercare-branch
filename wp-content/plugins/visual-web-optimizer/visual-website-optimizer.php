<?php
/**
 *
 * Plugin Name: VWO
 * Plugin URI: https://vwo.com/
 * Description: VWO is the all-in-one platform that helps you conduct visitor research, build an optimization roadmap, and run continuous experimentation. Simply enable the plugin and start running tests on your WordPress website without doing any other code changes. Visit <a href="https://vwo.com/">VWO</a> for more details.
 * Author: VWO
 * Version: 4.1
 * visual-website-optimizer.php
 * Author URI: https://vwo.com/
 *
 * @package VWO
 * @author VWO
 * @version 4.1
 **/

/**
 * Generate Common Code
 *
 * @param integer $vwo_clicks integer. Defaults to 10.
 */
function get_vwo_clhf_script_common_code( $vwo_clicks = 10 ) {
	ob_start();
	// @codingStandardsIgnoreStart
	?>
	<!-- Start VWO Common Smartcode -->
	<script <?php echo vwo_clhf_ignore_js_attr(); ?> type='text/javascript'>
		var _vwo_clicks = <?php echo esc_html( $vwo_clicks ); ?>;
	</script>
	<!-- End VWO Common Smartcode -->
	<?php
	// @codingStandardsIgnoreEnd
	$script_code = ob_get_clean();
	return $script_code;
}

/**
 * Get ignore js field setting
 *
 * @return bool boolean
 */
function get_vwo_clhf_ignore_js() {
	$ignore_js = get_option( 'ignore_js' );
	$ignore_js = ( '1' === $ignore_js ) ? true : false;
	return $ignore_js;
}

/**
 * Get ignore js script attribute value
 *
 * @return string Returns script attribute value
 */
function vwo_clhf_ignore_js_attr() {
	$ignore_js = get_vwo_clhf_ignore_js();
	$js_attr   = '';
	if ( function_exists( 'get_vwo_clhf_ignore_js' ) && $ignore_js ) {
		$js_attr = 'data-cfasync="false" nowprocket';
	}
	return $js_attr;
}

/**
 * Generate Synchronous Code
 *
 * @param int $vwo_id integer. Defaults to 0.
 * @return string string for sync script.
 */
function get_vwo_clhf_script_sync_code( $vwo_id = 0 ) {
	ob_start();
	// @codingStandardsIgnoreStart
	?>
	<!-- Start VWO Smartcode -->
	<script <?php echo vwo_clhf_ignore_js_attr(); ?> src="https://dev.visualwebsiteoptimizer.com/lib/<?php echo esc_html( $vwo_id ); ?>.js"></script>
	<!-- End VWO Smartcode -->
	<?php
	// @codingStandardsIgnoreEnd
	$sync_script = ob_get_clean();
	return $sync_script;
}

/**
 * Generate Asynchronous Code
 *
 * @param int  $vwo_id integer.
 * @param int  $settings_tolerance integer.
 * @param int  $library_tolerance integer.
 * @param bool $use_existing_jquery boolean.
 * @return string String for async script.
 */
function get_vwo_clhf_script_async_code( $vwo_id, $settings_tolerance, $library_tolerance, $use_existing_jquery ) {
	ob_start();
	// @codingStandardsIgnoreStart
	?>
	<!-- Start VWO Async SmartCode -->
	<link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
	<script <?php echo vwo_clhf_ignore_js_attr(); ?> type='text/javascript' id='vwoCode'>
	/* Fix: wp-rocket (application/ld+json) */
	window._vwo_code || (function() {
	var account_id= <?php echo esc_html( $vwo_id ); ?>,
	version = 2.0,
	settings_tolerance= <?php echo esc_html( $settings_tolerance ); ?>,
	library_tolerance= <?php echo esc_html( $library_tolerance ); ?>,
	use_existing_jquery= <?php echo ( $use_existing_jquery ) ? 'true' : 'false'; ?>,
	hide_element='body',
	hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
	/* DO NOT EDIT BELOW THIS LINE */
	f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(){if(!f){f=true;var e=d.getElementById('_vis_opt_path_hides');if(e)e.parentNode.removeChild(e)}},finished:function(){return f},load:function(e){var t=this.getSettings(),n=d.createElement('script'),i=this;if(t){n.textContent=t;d.getElementsByTagName('head')[0].appendChild(n);if(!w.VWO||VWO.caE){stT.removeItem(cK);i.load(e)}}else{n.fetchPriority='high';n.src=e;n.type='text/javascript';n.onerror=function(){_vwo_code.finish()};d.getElementsByTagName('head')[0].appendChild(n)}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);var t=d.currentScript,n=d.createElement('style'),i=this.hide_element(),r=t&&!t.async&&i?i+this.hide_element_style():'',c=d.getElementsByTagName('head')[0];n.setAttribute('id','_vis_opt_path_hides');v&&n.setAttribute('nonce',v.nonce);n.setAttribute('type','text/css');if(n.styleSheet)n.styleSheet.cssText=r;else n.appendChild(d.createTextNode(r));c.appendChild(n);this.load('https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&vn='+version)}};w._vwo_code=code;code.init();})();
	</script>
	<!-- End VWO Async SmartCode -->
	<?php
	// @codingStandardsIgnoreEnd
	$async_script = ob_get_clean();
	return $async_script;
}

// ------------------------------------------------------------------------//
// ---Hook-----------------------------------------------------------------//
// ------------------------------------------------------------------------//
add_action( 'wp_head', 'vwo_clhf_headercode', 1 );
add_action( 'admin_menu', 'vwo_clhf_plugin_menu' );
add_action( 'admin_init', 'vwo_clhf_register_mysettings' );
add_action( 'admin_notices', 'vwo_clhf_warn_nosettings' );


// ------------------------------------------------------------------------//
// ---Functions------------------------------------------------------------//
// ------------------------------------------------------------------------//
// options page link

/**
 * Generate a function comment for the given function body.
 *
 * @throws Exception Description of exception.
 * @return void
 */
function vwo_clhf_plugin_menu() {
	add_options_page( 'Visual Website Optimizer', 'VWO', 'create_users', 'clhf_vwo_options', 'vwo_clhf_plugin_options' );
}

/**
 * Register the settings for the VWO options.
 *
 * @return void
 */
function vwo_clhf_register_mysettings() {
	register_setting( 'clhf_vwo_options', 'vwo_id', 'intval' );
	register_setting( 'clhf_vwo_options', 'code_type' );
	register_setting( 'clhf_vwo_options', 'vwo_clicks' );
	register_setting( 'clhf_vwo_options', 'ignore_js', 'boolval' );
	register_setting( 'clhf_vwo_options', 'settings_tolerance', 'intval' );
	register_setting( 'clhf_vwo_options', 'library_tolerance', 'intval' );
	register_setting( 'clhf_vwo_options', 'use_existing_jquery', 'boolval' );
}

// ------------------------------------------------------------------------//
// ---Output Functions-----------------------------------------------------//
// ------------------------------------------------------------------------//


/**
 * Generates the action vwo_clhf_headercode function.
 *
 * @throws Exception Description of exception.
 * @return void
 */
function vwo_clhf_headercode() {
	// Runs in the header.
	$vwo_id    = get_option( 'vwo_id' );
	$code_type = get_option( 'code_type' );

	if ( $vwo_id ) {
		if ( empty( get_option( 'vwo_clicks' ) ) ) {
			update_option( 'vwo_clicks', '10' );
		}
		$vwo_clicks = get_option( 'vwo_clicks' );

		// Common script code.
		// @codingStandardsIgnoreLine
		echo get_vwo_clhf_script_common_code( $vwo_clicks );

		if ( 'SYNC' === $code_type ) {
			// Sync script code.
			// @codingStandardsIgnoreLine
			echo get_vwo_clhf_script_sync_code( $vwo_id );
		} else {

			$settings_tolerance = get_option( 'settings_tolerance' );
			if ( ! is_numeric( $settings_tolerance ) ) {
				$settings_tolerance = 2000;
			}

			$library_tolerance = get_option( 'library_tolerance' );
			if ( ! is_numeric( $library_tolerance ) ) {
				$library_tolerance = 2500;
			}

			$use_existing_jquery = get_option( 'use_existing_jquery' );
			$use_existing_jquery = ( '1' === $use_existing_jquery ) ? true : false;

			// Async script code.
			// @codingStandardsIgnoreLine
			echo get_vwo_clhf_script_async_code( $vwo_id, $settings_tolerance, $library_tolerance, $use_existing_jquery );
		}
	}
}

// ------------------------------------------------------------------------//
// ---Page Output Functions------------------------------------------------//
// ------------------------------------------------------------------------//
// options page


/**
 * Generates the options page for the VWO plugin.
 *
 * @throws Exception Description of exception.
 * @return void
 */
function vwo_clhf_plugin_options() {
	// Set value for checkbox by default.
	$ignore_js_options = get_option( 'ignore_js' );
	$show_ignore_js    = $ignore_js_options;
	if ( false === $ignore_js_options ) {
		// Nothing is set, so apply the default here.
		$show_ignore_js = 1;
		update_option( 'ignore_js', '1' );
	}

	echo '<div class="wrap">';
	?>
	<h2>VWO</h2>
	<p>You need to have a <a href="https://vwo.com/">VWO</a> account in order to use this plugin. This plugin inserts the neccessary code into your WordPress site automatically without you having to touch anything. In order to use the plugin, you need to enter your VWO Account ID:</p>
	<form method="post" action="options.php">
	<?php settings_fields( 'clhf_vwo_options' ); ?>
	<table class="form-table">
		<tr valign="top">
			<th scope="row">Your VWO Account ID</th>
			<td><input type="text" name="vwo_id" value="<?php echo esc_html( get_option( 'vwo_id' ) ); ?>" /></td>
		</tr>
		<tr valign="top">
			<th scope="row">No. of Heatmap Clicks</th>
			<td><input type="number" name="vwo_clicks" value="<?php echo get_option( 'vwo_clicks' ) ? esc_html( get_option( 'vwo_clicks' ) ) : 10; ?>" min="3"/></td>
		</tr>
		<tr valign="top">
			<th scope="row">Code (default: Asynchronous)</th>
			<td>
				<input style="vertical-align: text-top;" type="radio" onclick="selectCodeType();" name="code_type" id="code_type_async" value="ASYNC" 
				<?php
				if ( get_option( 'code_type' ) !== 'SYNC' ) {
					echo 'checked';}
				?>
				/> Asynchronous&nbsp;&nbsp;&nbsp;
				<input style="vertical-align: text-top;" type="radio" onclick="selectCodeType();" name="code_type" id="code_type_sync" value="SYNC" 
				<?php
				if ( get_option( 'code_type' ) === 'SYNC' ) {
					echo 'checked';}
				?>
				/> Synchronous
				&nbsp;<a href="https://vwo.com/blog/asynchronous-code" target="_blank">[Help]</a>
			</td>
		</tr>
		<tr valign="top" id='asyncOnly1' 
		<?php
		if ( get_option( 'code_type' ) === 'SYNC' ) {
			echo "style='display:none;'";}
		?>
		>
			<th scope="row">Settings Timeout</th>
			<td style="vertical-align: middle;"><input type="text" name="settings_tolerance" value="<?php echo get_option( 'settings_tolerance' ) ? esc_html( get_option( 'settings_tolerance' ) ) : 2000; ?>" />ms  (default: 2000)</td>
		</tr>
		<tr valign="top" id='asyncOnly2' 
		<?php
		if ( get_option( 'code_type' ) === 'SYNC' ) {
			echo "style='display:none;'";}
		?>
		>
			<th scope="row">Library Timeout</th>
			<td style="vertical-align: middle;"><input type="text" name="library_tolerance" value="<?php echo get_option( 'library_tolerance' ) ? esc_html( get_option( 'library_tolerance' ) ) : 2500; ?>" />ms  (default: 2500)</td>
		</tr>
			<tr valign="top" id='asyncOnly3' 
			<?php
			if ( get_option( 'code_type' ) === 'SYNC' ) {
				echo "style='display:none;'";}
			?>
			>
			<th scope="row">Use Existing jQuery</th>
				<td style="vertical-align: middle;"><input type="checkbox" name="use_existing_jquery" value="1" 
				<?php
				if ( get_option( 'use_existing_jquery' ) === '1' ) {
					echo 'checked';}
				?>
				/>Yes</td>
		</tr>
		<tr valign="top">
			<th scope="row">Skip Deferred Execution</th>
			<td style="vertical-align: middle;"><input type="checkbox" name="ignore_js" value="1"  
			<?php
			if ( '1' === $show_ignore_js ) {
				echo 'checked';}
			?>
			/>Yes</td>
		</tr>
	</table>

	<script type="text/javascript">
		function selectCodeType() {
			var code_type = 'ASYNC';
			if(document.getElementById('code_type_sync').checked)
				code_type = 'SYNC';

			if(code_type == 'ASYNC') {
				document.getElementById('asyncOnly1').style.display = 'table-row';
				document.getElementById('asyncOnly2').style.display = 'table-row';
				document.getElementById('asyncOnly3').style.display = 'table-row';
			}
			else {
				document.getElementById('asyncOnly1').style.display = 'none';
				document.getElementById('asyncOnly2').style.display = 'none';
				document.getElementById('asyncOnly3').style.display = 'none';
			}
		}
	</script>
	<p class="submit"><input type="submit" class="button-primary" value="<?php echo esc_html( 'Save Changes' ); ?>" /></p>
	<p>Your Account ID (a number) can be found in <i>Settings</i> area (top-right) after you <a href="https://app.vwo.com">login</a> into your VWO account.</p>
	<?php
	echo '</div>';
}

/**
 * Displays a warning message if VWO settings are not configured.
 * This function checks if the user is an admin and if the VWO ID option is set. If the user is not an admin or
 * the VWO ID option is not set, it displays a warning message.
 *
 * @throws Exception Description of exception.
 * @return void
 */
function vwo_clhf_warn_nosettings() {
	if ( ! is_admin() ) {
		return;
	}

	$clhf_option = get_option( 'vwo_id' );
	if ( ! $clhf_option || $clhf_option < 1 ) {
		echo "<div id='vwo-warning' class='updated fade'><p><strong>VWO is almost ready.</strong> You must <a href=\"options-general.php?page=clhf_vwo_options\">enter your Account ID</a> for it to work.</p></div>";
	}
}


add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'vwo_clhf_add_plugin_page_settings_link' );

/**
 * Function to add Settings Links on Plugin page
 *
 * @param array $links Array of links.
 * @return array
 */
function vwo_clhf_add_plugin_page_settings_link( $links ) {
	$links[] = '<a href="' .
		admin_url( 'options-general.php?page=clhf_vwo_options' ) .
		'">' . __( 'Settings' ) . '</a>';
	return $links;
}

/**
 * Disables VWO in Divi Builder.
 *
 * @throws Exception Description of exception.
 * @return void
 */
function disable_vwo_in_divi_builder() {
	if ( has_action( 'wp_head', 'vwo_clhf_headercode' ) && function_exists( 'et_core_is_fb_enabled' ) && et_core_is_fb_enabled() ) {
		remove_action( 'wp_head', 'vwo_clhf_headercode', 1 );
	}
}

add_action( 'wp_head', 'disable_vwo_in_divi_builder', 0 );

?>