<?php
/**
 * Plugin Name:         Zen calendar
 * Plugin URI:          https://github.com/leomayer/zen-calendar
 * Description:         A calendar app to the void - written in Angular
 * Version:             1.0.0
 * Author:              Leo Mayer
 * Author URI:          https://nowhere.gv
 *
 */

// Plugin-Informationen
define('ZEN_CAL_PLUGIN_NAME', 'Zen calendar');
define('ZEN_CAL_PLUGIN_VERSION', '1.0');
define('ZEN_NAMESPACE', 'zen_calendar/v1');
// Define the capability name
define('ZEN_CAL_MANAGE_SETTINGS_CAP', 'manage_zen_calendar');
define('ZEN_CAL_SLUG', 'zen-calendar-settings');

// Scripts for Angular script
function load_ng_scripts()
{
    wp_enqueue_style('ng_styles', plugin_dir_url(__FILE__) . 'dist/styles.109994348556e96a.css');
    wp_register_script('ng_main', plugin_dir_url(__FILE__) . 'dist/main.80ec284f35b33c5e.js', true);
    wp_register_script('ng_polyfills', plugin_dir_url(__FILE__) . 'dist/polyfills.0899932fdd15363a.js', true);
    wp_register_script('ng_runtime', plugin_dir_url(__FILE__) . 'dist/runtime.d828c3a65864714d.js', true);
}

function zen_cal_install()
{
    global $wpdb;
    $tblBasic = $wpdb->prefix . "zencalendar_basic";
    $tblDetails = $wpdb->prefix . "zencalendar_details";
    $charset_collate = $wpdb->get_charset_collate();

    // create Basic Table
    $sqlBasic = "CREATE TABLE $tblBasic (
  id INT NOT NULL AUTO_INCREMENT,
  eventStartDate DATE NOT NULL,
  eventStartTime INT NOT NULL COMMENT 'minutes since midnight',
  eventEndDate DATE NOT NULL,
  eventEndTime INT NOT NULL COMMENT 'minutes since midnight',
  frequType INT NOT NULL COMMENT '0:None, 1:weekly, 2:monthly, 3:yearly, 4: daily',
  isValid BOOLEAN DEFAULT TRUE,
  isOnlyEntry4Day BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'If true => all other events on this day are ignored',
  PRIMARY KEY (`id`)
  ) COMMENT = 'BasisInfo für den Überblick' $charset_collate;";

    // create Detail Table
    $sqlDetails = "CREATE TABLE $tblDetails (
  id INT NOT NULL AUTO_INCREMENT,
  calBasicId INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lang VARCHAR(5) NOT NULL,
  link TEXT NOT NULL,
  linkTitle TEXT NOT NULL COMMENT 'display text for the link',
  linkType TEXT NOT NULL COMMENT 'url, zoom, email, undefined',
  PRIMARY KEY (id),
  FOREIGN KEY (calBasicId) REFERENCES $tblBasic(id)
  ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sqlBasic);
    dbDelta($sqlDetails);
    add_option('ZEN_CAL_PLUGIN_VERSION', ZEN_CAL_PLUGIN_VERSION);
}

function attach_zen_cal()
{
    wp_enqueue_script('ng_main');
    wp_enqueue_script('ng_polyfills');
    wp_enqueue_script('ng_runtime');

    return '<app-root useConfigInterface="false"></app-root>';
}

// Einstellungen-Seite
function zen_calendar_add_settings_page()
{
    add_options_page(ZEN_CAL_PLUGIN_NAME, ZEN_CAL_PLUGIN_NAME, ZEN_CAL_MANAGE_SETTINGS_CAP, ZEN_CAL_SLUG, 'zen_calendar_settings_page');
}

// Darstellung der Einstellungs-Seite
function zen_calendar_settings_page()
{
    if (!current_user_can(ZEN_CAL_MANAGE_SETTINGS_CAP)) {
        return;
    }

    wp_enqueue_script('ng_main');
    wp_enqueue_script('ng_polyfills');
    wp_enqueue_script('ng_runtime');

    // Extract the hostname
    $currentHost = $_SERVER['HTTP_HOST'];
    // Set the AllowedOrigin variable
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        $AllowedOrigin = 'https://' . $currentHost;
    } else {
        $AllowedOrigin = 'http://' . $currentHost;
    }
    // Store the AllowedOrigin variable in the options database
    add_option('zen_calendar_allowed_origin', $AllowedOrigin);

    echo '<div>Welcome to admin page for "'
        . ZEN_CAL_PLUGIN_NAME . '" Version: ' . ZEN_CAL_PLUGIN_VERSION
        . '<br> last updated at: <strong><!--build-time-->25.3.2024 15:48:48'
        . ' </strong>'
        . '<br>Allowed host: <strong>' . $AllowedOrigin . '</strong>'
        . '</div><app-root useConfigInterface="true"></app-root>';
}
// Query the calender for Event of the given month
function get_wp_zen_calendar4month($request)
{
    $useMonth = $request->get_param('useMonth');

    global $wpdb;
    $tblBasic = $wpdb->prefix . "zencalendar_basic";

    $calOverview = $wpdb->get_results("SELECT id, eventStartDate, eventEndDate, frequType, isOnlyEntry4Day
      FROM $tblBasic
      WHERE isValid=TRUE
        AND  DATE_FORMAT('$useMonth', '%Y-%m-01') <= eventEndDate
        AND  eventStartDate <= DATE_ADD(DATE_FORMAT('$useMonth', '%Y-%m-01'), INTERVAL 1 MONTH)
      ORDER BY eventStartDate;");
    echo json_encode($calOverview);
}

// Query the details for the Event
function get_wp_zen_eventDetails($request)
{
    $useEventId = $request->get_param('eventId');
    $useLang = $request->get_param('lang');
    global $wpdb;
    $tblDetails = $wpdb->prefix . "zencalendar_details";
    $tblBasic = $wpdb->prefix . "zencalendar_basic";

    $calDetails = $wpdb->get_results("SELECT title, description,eventStartTime, eventEndTime, link, linkTitle, linkType
      FROM $tblDetails as zDet
      JOIN $tblBasic zBasic on (calBasicId=zBasic.id)
      WHERE calBasicId in ($useEventId)
        AND  lang='$useLang'
      ORDER BY eventStartTime;");
    echo json_encode($calDetails);
}

function get_events($request)
{
    $params = $request['eventId'];
    // Validate request parameters
    if (!isset($params)) {
        return new WP_Error('400', 'Missing event ID');
    }

    $eventIds = explode(',', $params); // Extract event IDs from the comma-separated list
    // Retrieve event data from the database
    global $wpdb;
    $tblDetails = $wpdb->prefix . "zencalendar_details";
    $tblBasic = $wpdb->prefix . "zencalendar_basic";

    $calDetails = $wpdb->get_results("SELECT zDet.id, calBasicId, title, description, lang, eventStartTime, eventEndTime, link, linkTitle, linkType
      FROM $tblDetails as zDet
      JOIN $tblBasic zBasic on (calBasicId=zBasic.id)
      WHERE calBasicId in (" . implode(',', $eventIds) . ")
      ORDER BY eventStartTime;");
    echo json_encode($calDetails);
}

function update_eventDetails($request)
{
    $AllowedOrigin = get_option('zen_calendar_allowed_origin');
    // $AllowedOrigin = get_option('zen_calendar_compare_origin');
    if (!(getallheaders()['origin'] === $AllowedOrigin)) {
        return new WP_Error('401', 'Permissions  missing1: ' . getallheaders()['origin'] . '<=>' . $AllowedOrigin);
    }

    // Validate request data
    $id = intval($request->get_param('id'));
    $title = $request->get_param('title');
    $description = $request->get_param('description');
    $lang = $request->get_param('lang');
    $link = $request->get_param('link');
    $linkType = $request->get_param('linkType');
    $linkTitle = $request->get_param('linkTitle');
    $isUpdate = $request->get_param('isUpdate'); // Get the value of the isUpdate parameter
    $calBasicId = intval($request->get_param('calBasicId'));

    if (
        $isUpdate === null ||
            // check id if update is requested
        (!$id && $isUpdate) ||
            // for an insert we need to have the reference id
        (!$isUpdate && !$calBasicId)
        || $title === null || $description === null || $lang === null || $link === null || $linkType === null || $linkTitle === null
    ) {
        return new WP_Error('400', 'Invalid request data');
    }

    // Update event details in database
    global $wpdb;
    $tblDetails = $wpdb->prefix . "zencalendar_details";

    if ($isUpdate) {
        $query = "UPDATE $tblDetails SET title = %s, description = %s, lang = %s, link = %s, linkTitle = %s, linkType = %s WHERE id = %d";
        $params = array($title, $description, $lang, $link, $linkTitle, $linkType, $id);
    } else {
        $query = "INSERT INTO $tblDetails SET title = %s, description = %s, lang = %s, link = %s, linkTitle = %s, linkType = %s, calBasicId = %d ";
        $params = array($title, $description, $lang, $link, $linkTitle, $linkType, $calBasicId);
    }
    $statement = $wpdb->prepare(
        $query,
        $params
    );

    $result = $wpdb->query($statement);
    return handleQueryResult($result, $wpdb, $isUpdate);
}

function update_eventBasic($request)
{
    $AllowedOrigin = get_option('zen_calendar_allowed_origin');
    // $AllowedOrigin = get_option('zen_calendar_compare_origin');
    if (!(getallheaders()['origin'] === $AllowedOrigin)) {
        return new WP_Error('401', 'Permissions  missing: ' . getallheaders()['origin'] . '<=>' . $AllowedOrigin);
    }

    // Validate request data
    $id = intval($request->get_param('id'));
    $eventStartDate = $request->get_param('eventStartDate');
    $eventStartTime = $request->get_param('eventStartTime');
    $eventEndDate = $request->get_param('eventEndDate');
    $eventEndTime = $request->get_param('eventEndTime');
    $frequType = $request->get_param('frequType');
    $isValid = $request->get_param('isValid');
    $isOnlyEntry4Day = $request->get_param('isOnlyEntry4Day');
    $isUpdate = $request->get_param('isUpdate'); // Get the value of the isUpdate parameter

    if (
        $isUpdate === null ||
            // check id if update is requested
        (!$id && $isUpdate) || $eventStartDate === null || $eventStartTime === null || $eventEndDate === null ||
        $eventEndTime === null || $frequType === null || $isValid === null || $isOnlyEntry4Day === null
    ) {
        return new WP_Error('400', 'Invalid request data');
    }

    // Update event details in database
    global $wpdb;
    $tblDetails = $wpdb->prefix . "zencalendar_basic";

    if ($isUpdate) {
        $query = "UPDATE $tblDetails SET eventStartDate = %s, eventStartTime = %s, eventEndDate = %s, eventEndTime = %s, frequType = %s, isValid = %s, isOnlyEntry4Day=%d WHERE id = %d";
    } else {
        $query = "INSERT INTO $tblDetails SET eventStartDate = %s, eventStartTime = %s, eventEndDate = %s, eventEndTime = %s, frequType = %s, isValid = %s, isOnlyEntry4Day=%d, id = %d";
    }
    $statement = $wpdb->prepare(
        $query,
        array(
            $eventStartDate,
            $eventStartTime,
            $eventEndDate,
            $eventEndTime,
            $frequType,
            $isValid,
            $isOnlyEntry4Day,
            $id
        )
    );

    $result = $wpdb->query($statement);
    return handleQueryResult($result, $wpdb, $isUpdate);
}

function handleQueryResult($result, $wpdb, $isUpdate)
{
    if ($result) {
        if ($isUpdate) {
            if ($wpdb->affected_rows > 0) {
                return new WP_REST_Response('EventBasic updated successfully', 200);
            } else {
                return new WP_REST_Response('Update not done', 204);
            }
        } else {
            // Get the current ID of the updated row
            $newId = $wpdb->insert_id;
            return new WP_REST_Response($newId, 200);
        }
    } else {
        if ($result === false) {
            return new WP_Error('500', 'Error updating event');
        }
        return new WP_REST_Response('Update not done', 204);
    }
}

// Register the useMonth parameter
function register_custom_parameter()
{
    register_rest_field(
        'calendar4month', // Replace with your custom endpoint name
        'useMonth',
        array(
            'get_callback' => 'get_useMonth',
            'update_callback' => null,
            'schema' => null
        )
    );

    $params = array(
        'eventId' => array(
            'get_callback' => 'get_event_id',
            'update_callback' => null,
            'schema' => null
        ),
        'lang' => array(
            'get_callback' => 'get_lang',
            'update_callback' => null,
            'schema' => null
        )
    );

    register_rest_field('zenEvent', $params);
}

// Define a callback function for the use month parameter
function get_useMonth($object, $field_name, $request)
{
    return $request['useMonth'];
}

function get_event_id($object, $field_name, $request)
{
    return $request['eventId'];
}

function get_lang($object, $field_name, $request)
{
    return $request['lang'];
}

function run_inits()
{
    // make sure the Angular scripts are loaded
    load_ng_scripts();
    // assign the capabilities
    $admin_role = get_role('administrator');
    if (!$admin_role->has_cap(ZEN_CAL_MANAGE_SETTINGS_CAP)) {
        $admin_role->add_cap(ZEN_CAL_MANAGE_SETTINGS_CAP);
    }
}

function zen_calendar_plugin_action_links($links)
{
    $settings_link = '<a href="' . admin_url('options-general.php?page=' . ZEN_CAL_SLUG) . '">' . __('Settings') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}

add_action('wp_enqueue_scripts', 'load_ng_scripts');
register_activation_hook(__FILE__, 'zen_cal_install');

add_action('rest_api_init', function () {
    register_custom_parameter();
    register_rest_route(
        ZEN_NAMESPACE,
        'calendar4month',
        array(
            'methods' => 'GET',
            'callback' => 'get_wp_zen_calendar4month',
            'permission_callback' => '__return_true'
        )
    );
    register_rest_route(
        ZEN_NAMESPACE,
        'zenEvent',
        array(
            'methods' => 'GET',
            'callback' => 'get_wp_zen_eventDetails',
            'permission_callback' => '__return_true'
        )
    );
    register_rest_route(ZEN_NAMESPACE, 'zenEventDetails', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'get_events'
    ]);
    register_rest_route(ZEN_NAMESPACE, 'updateDetails', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'update_eventDetails'
    ]);
    register_rest_route(ZEN_NAMESPACE, 'updateBasics', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'update_eventBasic'
    ]);
});

// Plugin-Hooks
add_action('admin_menu', 'zen_calendar_add_settings_page');

add_action('admin_init', 'run_inits');

add_shortcode('zen_cal', 'attach_zen_cal');

// open the options automatically
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'zen_calendar_plugin_action_links');

// Add the shortcode [zen_cal] to any page or post.
// The shorcode can be whatever. [zen_cal] is just an example.
?>