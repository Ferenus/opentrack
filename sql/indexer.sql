SELECT to_json(a) FROM (SELECT container.id AS "_id",
                               container_id,
                               port.name     AS "port_name",
                               terminal.name AS "terminal_name",
                               terminal.firms_code,
                               vessel.name   AS "vessel_name",
                               vessel.imo
                        FROM container
                               LEFT JOIN vessel ON vessel.id = container.vessel_id
                               LEFT JOIN terminal ON terminal.id = vessel.terminal_id
                               LEFT JOIN port ON port.id = terminal.port_id
) AS a