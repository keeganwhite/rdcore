drop procedure if exists add_sqm_profiles;

delimiter //
create procedure add_sqm_profiles()
begin

if not exists (select * from information_schema.columns
    where table_name = 'sqm_profiles' and table_schema = 'rd') then
     CREATE TABLE `sqm_profiles` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `cloud_id` int(11) DEFAULT NULL,
        `upload` int(11) NOT NULL DEFAULT 2032,
        `download` int(11) NOT NULL DEFAULT 14698,
        `linklayer` varchar(10) NOT NULL,
        `overhead` INT NOT NULL,
        `tcMTU` INT NOT NULL,
        `tcTSIZE` INT NOT NULL,
        `tcMPU` INT NOT NULL,
        `ilimit` INT NOT NULL,
        `elimit` INT NOT NULL,
        `itarget` VARCHAR(10) NOT NULL,
        `etarget` VARCHAR(10) NOT NULL,
        `ingress_ecn` VARCHAR(10) NOT NULL,
        `egress_ecn` VARCHAR(10) NOT NULL,
        `target` VARCHAR(10) NOT NULL,
        `squash_dscp` BOOLEAN NOT NULL,
        `squash_ingress` BOOLEAN NOT NULL,
        `qdisc` VARCHAR(20) NOT NULL,
        `script` VARCHAR(50) NOT NULL,
        `iqdisc_opts` TEXT,
        `eqdisc_opts` TEXT,
        `qdisc_advanced` BOOLEAN NOT NULL,
        `qdisc_really_advanced` BOOLEAN NOT NULL,
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;


end//

delimiter ;
call add_sqm_profiles
