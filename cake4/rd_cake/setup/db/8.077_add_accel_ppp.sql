drop procedure if exists add_accel_ppp;

delimiter //
create procedure add_accel_ppp()
begin

if not exists (select * from information_schema.columns
    where table_name = 'accel_servers' and table_schema = 'rd') then
	CREATE TABLE `accel_servers` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `cloud_id` int(11) NOT NULL,
      `accel_profile_id` int(11) NOT NULL,
      `name` varchar(255) NOT NULL,
      `mac` varchar(255) NOT NULL,
      `pppoe_interface` varchar(10) NOT NULL,
      `nas_identifier` varchar(32) NOT NULL,
      `server_type` enum('standalone','mesh','ap_profile') DEFAULT 'standalone',
      `config_fetched` datetime DEFAULT NULL,
      `last_contact` datetime DEFAULT NULL,
      `last_contact_from_ip` varchar(30) NOT NULL DEFAULT '',
      `restart_service_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'accel_profiles' and table_schema = 'rd') then
	CREATE TABLE `accel_profiles` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `cloud_id` int(11) NOT NULL,
      `name` varchar(255) NOT NULL,
      `base_config` varchar(255) NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'accel_profile_entries' and table_schema = 'rd') then
	CREATE TABLE `accel_profile_entries` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `accel_profile_id` int(11) NOT NULL,
      `section` varchar(255) NOT NULL,
      `item` varchar(255) NOT NULL,
      `value` varchar(255) NOT NULL,
      `no_key_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'accel_stats' and table_schema = 'rd') then
	CREATE TABLE `accel_stats` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `accel_server_id` int(11) NOT NULL,
      `version` varchar(255) NOT NULL,
      `uptime` varchar(255) NOT NULL,
      `cpu` varchar(255) NOT NULL,
      `mem` varchar(255) NOT NULL,
      `core` text NOT NULL,
      `sessions_active` int(11) NOT NULL,
      `sessions` text NOT NULL,
      `pppoe` text NOT NULL,
      `radius1` text NOT NULL,
      `radius2` text NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;


if not exists (select * from information_schema.columns
    where table_name = 'accel_sessions' and table_schema = 'rd') then
	CREATE TABLE `accel_sessions` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `accel_server_id` int(11) NOT NULL,
      `netns` varchar(255) NOT NULL DEFAULT '',
      `vrf` varchar(255) NOT NULL DEFAULT '',
      `ifname` varchar(255) NOT NULL DEFAULT '',
      `username` varchar(255) NOT NULL DEFAULT '',
      `ip` varchar(32) NOT NULL DEFAULT '',
      `ip6` varchar(32) NOT NULL DEFAULT '',
      `ip6_dp` varchar(32) NOT NULL DEFAULT '',
      `type` varchar(32) NOT NULL DEFAULT '',
      `state` varchar(32) NOT NULL DEFAULT '',
      `uptime` varchar(32) NOT NULL DEFAULT '',
      `uptime_raw`  int(11) NOT NULL DEFAULT 0,
      `calling_sid` varchar(32) NOT NULL DEFAULT '',
      `called_sid` varchar(32) NOT NULL DEFAULT '',
      `sid` varchar(32) NOT NULL DEFAULT '',
      `comp` varchar(32) NOT NULL DEFAULT '',
      `rx_bytes` varchar(32) NOT NULL DEFAULT '',
      `tx_bytes` varchar(32) NOT NULL DEFAULT '',
      `rx_bytes_raw`  int(11) NOT NULL DEFAULT 0,
      `tx_bytes_raw`  int(11) NOT NULL DEFAULT 0,
      `rx_pkts`  int(11) NOT NULL DEFAULT 0,
      `tx_pkts`  int(11) NOT NULL DEFAULT 0,
      `inbound_if` varchar(32) NOT NULL DEFAULT '',
      `service_name` varchar(32) NOT NULL DEFAULT '',
      `rate_limit` varchar(32) NOT NULL DEFAULT '',
      `disconnect_flag` tinyint(1) NOT NULL DEFAULT '0',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'accel_arrivals' and table_schema = 'rd') then
        CREATE TABLE `accel_arrivals` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `mac` varchar(255) NOT NULL,
      `vendor` varchar(255) DEFAULT NULL,
      `last_contact` datetime DEFAULT NULL,
      `last_contact_from_ip` varchar(30) NOT NULL DEFAULT '',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;


alter table ap_profile_exits modify `type` enum('bridge','tagged_bridge','nat','captive_portal','openvpn_bridge','tagged_bridge_l3','pppoe_server') DEFAULT NULL; 
alter table mesh_exits modify `type` enum('bridge','tagged_bridge','nat','captive_portal','openvpn_bridge','tagged_bridge_l3','pppoe_server') DEFAULT NULL; 

if not exists (select * from information_schema.columns
    where table_name = 'mesh_exit_pppoe_servers' and table_schema = 'rd') then
        CREATE TABLE `mesh_exit_pppoe_servers` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `mesh_exit_id` int(11) NOT NULL,
      `accel_profile_id` int(11) NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;
end if;

if not exists (select * from information_schema.columns
    where table_name = 'ap_profile_exit_pppoe_servers' and table_schema = 'rd') then
        CREATE TABLE `ap_profile_exit_pppoe_servers` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `ap_profile_exit_id` int(11) NOT NULL,
      `accel_profile_id` int(11) NOT NULL,
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;
end if;


end//

delimiter ;
call add_accel_ppp;
