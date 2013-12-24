
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    tableObj: JSON.stringify({
      oneDimension: {"name":"global_victory_participants_this_quarter","title":"Global Victory Participants This Quarter","created_at":"2013-12-24","description":"Distinct users signing a petition that was declared a victory in this quarter","chartType":"value","location":"./queries/global_victory_participants_this_quarter.sql","query":"-- victory signers this quarters\nSELECT TRIM(TO_CHAR(APPROXIMATE COUNT(DISTINCT(s.user_id)), '999G999G999G999')) AS n\nFROM (\n  SELECT e.id AS victory_petition_id\n  FROM events e\n  LEFT JOIN victory_requests v ON e.id = v.petition_id\n  WHERE (\n    e.victory = 1\n    OR ( v.id IS NOT NULL AND v.deleted_at IS NULL )\n    )\n  AND (\n    e.victory_date >= DATE_TRUNC('QUARTER', CURRENT_DATE)\n    OR v.created_at >= DATE_TRUNC('QUARTER', CURRENT_DATE)\n    )\n  )v\nJOIN public.signatures_petitions s ON s.petition_id = v.victory_petition_id;","rows":[[{"name":"n","value":12345678}]],"dimensions":1},
      oneDimensionB: {"name":"global_victory_petitions","title":"Global Victory Petitions","created_at":"2013-12-24","description":"All-time number of petitions declared as victorious","chartType":"value","location":"./queries/global_victory_petitions.sql","query":"SELECT TRIM(TO_CHAR(COUNT(1), '999G999G999G999G999')) AS n\nFROM (\n  SELECT e.id AS petition_id, APPROXIMATE COUNT(DISTINCT(s.id)) AS n\n  FROM events e\n  LEFT JOIN victory_requests v ON e.id = v.petition_id\n  JOIN signatures_petitions s ON s.petition_id = e.id\n  WHERE (e.victory = 1 OR ( v.id IS NOT NULL AND v.deleted_at IS NULL ))\n  GROUP BY e.id\n  HAVING APPROXIMATE COUNT(DISTINCT(s.id)) >= 5\n  );","rows":[[{"name":"n","value":"787878"}]],"dimensions":1},
      twoDimension: {"name":"global_victory_signers_by_month_and_goal","title":"Cumulative Victory Signers by Month","created_at":"2013-12-24","description":"description goes here","chartType":"line","location":"./queries/global_victory_signers_by_month_and_goal.sql","query":"SELECT -- ACTUAL CUMULATIVE MONTHLY VICTORY SIGNERS + GOAL\n  actual.m\n, actual.n_cum\n, CASE WHEN goal.n_cum IS NULL THEN 0 ELSE goal.n_cum END AS n_cum\nFROM ( -- ACTUAL\n  SELECT m, n_cum\n  FROM (\n    -- quarterly new victory signers\n    SELECT TO_CHAR(victory_date, 'YYYY-MM-01') AS m, SUM(COUNT(1)) OVER (ORDER BY TO_CHAR(victory_date, 'YYYY-MM-01') ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS n_cum\n    FROM(\n      -- all victory signers with the date of the first victory they signed\n      SELECT s.user_id, MIN(victory_date) AS victory_date\n      FROM signatures_petitions s\n      JOIN (\n        -- in case of multiple victory dates, choose the first\n        SELECT petition_id, MIN(victory_date) AS victory_date\n        FROM (\n          -- all victory petitions and date\n          SELECT e.id AS petition_id, CASE WHEN v.created_at IS NOT NULL THEN v.created_at ELSE e.victory_date END AS victory_date\n          FROM events e\n          LEFT JOIN victory_requests v ON e.id = v.petition_id\n          WHERE (e.victory = 1 OR (v.created_at IS NOT NULL AND v.deleted_at IS NULL))\n          )\n        GROUP BY petition_id\n        )e ON e.petition_id = s.petition_id\n      GROUP BY s.user_id\n      )\n    GROUP BY m\n    )\n  WHERE m >= '2012-01-01'\n  )actual\n\nLEFT JOIN ( -- GOAL\n  SELECT '2013-06-01' AS m, 13142000 AS n_cum\n  UNION\n  SELECT '2013-07-01' AS m, 14285000 AS n_cum\n  UNION\n  SELECT '2013-08-01' AS m, 15428000 AS n_cum\n  UNION\n  SELECT '2013-09-01' AS m, 16571000 AS n_cum\n  UNION  \n  SELECT '2013-10-01' AS m, 17714000 AS n_cum\n  UNION\n  SELECT '2013-11-01' AS m, 18857000 AS n_cum\n  UNION\n  SELECT '2013-12-01' AS m, 20000000 AS n_cum\n  UNION\n  SELECT '2014-01-01' AS m, 2183333 AS n_cum\n  UNION\n  SELECT '2014-02-01' AS m, 23666667 AS n_cum\n  UNION\n  SELECT '2014-03-01' AS m, 25500000 AS n_cum\n  UNION\n  SELECT '2014-04-01' AS m, 27333333 AS n_cum\n  UNION\n  SELECT '2014-05-01' AS m, 29166667 AS n_cum\n  UNION\n  SELECT '2014-06-01' AS m, 31000000 AS n_cum\n  UNION\n  SELECT '2014-07-01' AS m, 33333333 AS n_cum\n  UNION\n  SELECT '2014-08-01' AS m, 35666667 AS n_cum\n  UNION\n  SELECT '2014-09-01' AS m, 38000000 AS n_cum\n  UNION\n  SELECT '2014-10-01' AS m, 40333333 AS n_cum\n  UNION\n  SELECT '2014-11-01' AS m, 42666667 AS n_cum\n  UNION\n  SELECT '2014-12-01' AS m, 45000000 AS n_cum\n  UNION\n  SELECT '2015-01-01' AS m, 48333333 AS n_cum\n  UNION\n  SELECT '2015-02-01' AS m, 51666667 AS n_cum\n  UNION\n  SELECT '2015-03-01' AS m, 55000000 AS n_cum\n  UNION\n  SELECT '2015-04-01' AS m, 58333333 AS n_cum\n  UNION\n  SELECT '2015-05-01' AS m, 61666667 AS n_cum\n  UNION\n  SELECT '2015-06-01' AS m, 65000000 AS n_cum\n  UNION\n  SELECT '2015-07-01' AS m, 70833333 AS n_cum\n  UNION\n  SELECT '2015-08-01' AS m, 76666667 AS n_cum\n  UNION\n  SELECT '2015-09-01' AS m, 82500000 AS n_cum\n  UNION\n  SELECT '2015-10-01' AS m, 88333333 AS n_cum\n  UNION\n  SELECT '2015-11-01' AS m, 94166667 AS n_cum\n  UNION\n  SELECT '2015-12-01' AS m, 100000000 AS n_cum\n  )goal ON actual.m = goal.m\nORDER BY actual.m;","rows":[[{"name":"n_cum","value":0,"yLabel":"2012-01-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-02-01"}],[{"name":"n_cum","value":1,"yLabel":"2012-03-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-04-01"}],[{"name":"n_cum","value":2,"yLabel":"2012-05-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-06-01"}],[{"name":"n_cum","value":3,"yLabel":"2012-07-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-08-01"}],[{"name":"n_cum","value":4,"yLabel":"2012-09-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-10-01"}],[{"name":"n_cum","value":5,"yLabel":"2012-11-01"}],[{"name":"n_cum","value":0,"yLabel":"2012-12-01"}],[{"name":"n_cum","value":6,"yLabel":"2013-01-01"}],[{"name":"n_cum","value":0,"yLabel":"2013-02-01"}],[{"name":"n_cum","value":7,"yLabel":"2013-03-01"}],[{"name":"n_cum","value":0,"yLabel":"2013-04-01"}],[{"name":"n_cum","value":8,"yLabel":"2013-05-01"}],[{"name":"n_cum","value":1142000,"yLabel":"2013-06-01"}],[{"name":"n_cum","value":2285000,"yLabel":"2013-07-01"}],[{"name":"n_cum","value":35428000,"yLabel":"2013-08-01"}],[{"name":"n_cum","value":46571000,"yLabel":"2013-09-01"}],[{"name":"n_cum","value":57714000,"yLabel":"2013-10-01"}],[{"name":"n_cum","value":68857000,"yLabel":"2013-11-01"}],[{"name":"n_cum","value":70000000,"yLabel":"2013-12-01"}]],"dimensions":2,"yAxisLabel":"m"},
      threeDimension: {"name":"reach_report","title":"Reach Report","created_at":"2013-12-24","description":"Number of emails received by eligible users over the last 30 days","chartType":"table","location":"./queries/reach_report.sql","query":"SELECT\n  country, aas_received, COUNT(1) AS users\nFROM (\n  SELECT el.id AS user_id, u.country, COUNT(iar.unique_id) AS aas_received\n  FROM eligible_users el\n  JOIN users u ON u.id = el.id\n  LEFT JOIN individual_alert_records iar ON iar.user_id = el.id\n  WHERE u.country IN ('US', 'CA', 'DE', 'ES', 'FR', 'GB', 'IT', 'BY', 'RU', 'TR', 'UA', 'AR', 'BR', 'MX', 'AU', 'IN', 'JP', 'PH', 'TH', 'ID')\n  AND u.created_at < CURRENT_DATE - INTERVAL '30 DAYS'\n  AND (iar.created_at >= CURRENT_DATE - INTERVAL '30 DAYS' OR iar.created_at IS NULL)\n  GROUP BY el.id, u.country\n  )\nGROUP BY country, aas_received\nORDER BY country, aas_received;","rows":[[{"name":"users","value":"3045","yLabel":"AR","xLabel":"0"}],[{"name":"users","value":"1544","yLabel":"AR","xLabel":"1"}],[{"name":"users","value":"1800","yLabel":"AR","xLabel":"2"}],[{"name":"users","value":"171830","yLabel":"AR","xLabel":"3"}],[{"name":"users","value":"145686","yLabel":"AR","xLabel":"4"}],[{"name":"users","value":"215803","yLabel":"AR","xLabel":"5"}],[{"name":"users","value":"112001","yLabel":"AR","xLabel":"6"}],[{"name":"users","value":"50957","yLabel":"AR","xLabel":"7"}],[{"name":"users","value":"27386","yLabel":"AR","xLabel":"8"}],[{"name":"users","value":"12818","yLabel":"AR","xLabel":"9"}],[{"name":"users","value":"5589","yLabel":"AR","xLabel":"10"}],[{"name":"users","value":"2200","yLabel":"AR","xLabel":"11"}],[{"name":"users","value":"762","yLabel":"AR","xLabel":"12"}],[{"name":"users","value":"107","yLabel":"AR","xLabel":"13"}],[{"name":"users","value":"11","yLabel":"AR","xLabel":"14"}],[{"name":"users","value":"1","yLabel":"AR","xLabel":"15"}],[{"name":"users","value":"2199","yLabel":"AU","xLabel":"0"}],[{"name":"users","value":"2971","yLabel":"AU","xLabel":"1"}],[{"name":"users","value":"105836","yLabel":"AU","xLabel":"2"}],[{"name":"users","value":"220319","yLabel":"AU","xLabel":"3"}],[{"name":"users","value":"198291","yLabel":"AU","xLabel":"4"}],[{"name":"users","value":"230694","yLabel":"AU","xLabel":"5"}],[{"name":"users","value":"141503","yLabel":"AU","xLabel":"6"}],[{"name":"users","value":"77766","yLabel":"AU","xLabel":"7"}],[{"name":"users","value":"39552","yLabel":"AU","xLabel":"8"}],[{"name":"users","value":"18781","yLabel":"AU","xLabel":"9"}],[{"name":"users","value":"7269","yLabel":"AU","xLabel":"10"}],[{"name":"users","value":"2753","yLabel":"AU","xLabel":"11"}],[{"name":"users","value":"648","yLabel":"AU","xLabel":"12"}],[{"name":"users","value":"80","yLabel":"AU","xLabel":"13"}],[{"name":"users","value":"9","yLabel":"AU","xLabel":"14"}],[{"name":"users","value":"1","yLabel":"AU","xLabel":"15"}],[{"name":"users","value":"1199","yLabel":"BR","xLabel":"0"}],[{"name":"users","value":"13134","yLabel":"BR","xLabel":"1"}],[{"name":"users","value":"328771","yLabel":"BR","xLabel":"2"}],[{"name":"users","value":"478692","yLabel":"BR","xLabel":"3"}],[{"name":"users","value":"218942","yLabel":"BR","xLabel":"4"}],[{"name":"users","value":"112816","yLabel":"BR","xLabel":"5"}],[{"name":"users","value":"9354","yLabel":"BR","xLabel":"6"}],[{"name":"users","value":"172","yLabel":"BR","xLabel":"7"}],[{"name":"users","value":"2","yLabel":"BR","xLabel":"9"}],[{"name":"users","value":"271","yLabel":"BY","xLabel":"0"}],[{"name":"users","value":"1198","yLabel":"BY","xLabel":"1"}],[{"name":"users","value":"104160","yLabel":"BY","xLabel":"2"}],[{"name":"users","value":"19314","yLabel":"BY","xLabel":"3"}],[{"name":"users","value":"543","yLabel":"BY","xLabel":"4"}],[{"name":"users","value":"9","yLabel":"BY","xLabel":"5"}],[{"name":"users","value":"1","yLabel":"BY","xLabel":"6"}],[{"name":"users","value":"1","yLabel":"BY","xLabel":"7"}],[{"name":"users","value":"1366","yLabel":"CA","xLabel":"0"}],[{"name":"users","value":"2937","yLabel":"CA","xLabel":"1"}],[{"name":"users","value":"4023","yLabel":"CA","xLabel":"2"}],[{"name":"users","value":"120156","yLabel":"CA","xLabel":"3"}],[{"name":"users","value":"510289","yLabel":"CA","xLabel":"4"}],[{"name":"users","value":"366372","yLabel":"CA","xLabel":"5"}],[{"name":"users","value":"73791","yLabel":"CA","xLabel":"6"}],[{"name":"users","value":"12029","yLabel":"CA","xLabel":"7"}],[{"name":"users","value":"755","yLabel":"CA","xLabel":"8"}],[{"name":"users","value":"9","yLabel":"CA","xLabel":"9"}],[{"name":"users","value":"2","yLabel":"CA","xLabel":"10"}],[{"name":"users","value":"1411","yLabel":"DE","xLabel":"0"}],[{"name":"users","value":"1194","yLabel":"DE","xLabel":"1"}],[{"name":"users","value":"316939","yLabel":"DE","xLabel":"2"}],[{"name":"users","value":"295355","yLabel":"DE","xLabel":"3"}],[{"name":"users","value":"347468","yLabel":"DE","xLabel":"4"}],[{"name":"users","value":"121707","yLabel":"DE","xLabel":"5"}],[{"name":"users","value":"42823","yLabel":"DE","xLabel":"6"}],[{"name":"users","value":"18765","yLabel":"DE","xLabel":"7"}],[{"name":"users","value":"7904","yLabel":"DE","xLabel":"8"}],[{"name":"users","value":"2685","yLabel":"DE","xLabel":"9"}],[{"name":"users","value":"513","yLabel":"DE","xLabel":"10"}],[{"name":"users","value":"47","yLabel":"DE","xLabel":"11"}],[{"name":"users","value":"3","yLabel":"DE","xLabel":"12"}],[{"name":"users","value":"3013","yLabel":"ES","xLabel":"0"}],[{"name":"users","value":"5309","yLabel":"ES","xLabel":"1"}],[{"name":"users","value":"4442","yLabel":"ES","xLabel":"2"}],[{"name":"users","value":"95615","yLabel":"ES","xLabel":"3"}],[{"name":"users","value":"502171","yLabel":"ES","xLabel":"4"}],[{"name":"users","value":"673688","yLabel":"ES","xLabel":"5"}],[{"name":"users","value":"558187","yLabel":"ES","xLabel":"6"}],[{"name":"users","value":"563224","yLabel":"ES","xLabel":"7"}],[{"name":"users","value":"207949","yLabel":"ES","xLabel":"8"}],[{"name":"users","value":"61887","yLabel":"ES","xLabel":"9"}],[{"name":"users","value":"17405","yLabel":"ES","xLabel":"10"}],[{"name":"users","value":"3124","yLabel":"ES","xLabel":"11"}],[{"name":"users","value":"365","yLabel":"ES","xLabel":"12"}],[{"name":"users","value":"19","yLabel":"ES","xLabel":"13"}],[{"name":"users","value":"1","yLabel":"ES","xLabel":"14"}],[{"name":"users","value":"1","yLabel":"ES","xLabel":"16"}],[{"name":"users","value":"2513","yLabel":"FR","xLabel":"0"}],[{"name":"users","value":"2374","yLabel":"FR","xLabel":"1"}],[{"name":"users","value":"2083","yLabel":"FR","xLabel":"2"}],[{"name":"users","value":"1042356","yLabel":"FR","xLabel":"3"}],[{"name":"users","value":"340072","yLabel":"FR","xLabel":"4"}],[{"name":"users","value":"132679","yLabel":"FR","xLabel":"5"}],[{"name":"users","value":"58592","yLabel":"FR","xLabel":"6"}],[{"name":"users","value":"18552","yLabel":"FR","xLabel":"7"}],[{"name":"users","value":"4739","yLabel":"FR","xLabel":"8"}],[{"name":"users","value":"628","yLabel":"FR","xLabel":"9"}],[{"name":"users","value":"72","yLabel":"FR","xLabel":"10"}],[{"name":"users","value":"6","yLabel":"FR","xLabel":"11"}],[{"name":"users","value":"1","yLabel":"FR","xLabel":"12"}],[{"name":"users","value":"3742","yLabel":"GB","xLabel":"0"}],[{"name":"users","value":"4823","yLabel":"GB","xLabel":"1"}],[{"name":"users","value":"15758","yLabel":"GB","xLabel":"2"}],[{"name":"users","value":"63133","yLabel":"GB","xLabel":"3"}],[{"name":"users","value":"621392","yLabel":"GB","xLabel":"4"}],[{"name":"users","value":"871117","yLabel":"GB","xLabel":"5"}],[{"name":"users","value":"206565","yLabel":"GB","xLabel":"6"}],[{"name":"users","value":"99691","yLabel":"GB","xLabel":"7"}],[{"name":"users","value":"70230","yLabel":"GB","xLabel":"8"}],[{"name":"users","value":"39882","yLabel":"GB","xLabel":"9"}],[{"name":"users","value":"23838","yLabel":"GB","xLabel":"10"}],[{"name":"users","value":"16811","yLabel":"GB","xLabel":"11"}],[{"name":"users","value":"12325","yLabel":"GB","xLabel":"12"}],[{"name":"users","value":"8784","yLabel":"GB","xLabel":"13"}],[{"name":"users","value":"5919","yLabel":"GB","xLabel":"14"}],[{"name":"users","value":"3350","yLabel":"GB","xLabel":"15"}],[{"name":"users","value":"1344","yLabel":"GB","xLabel":"16"}],[{"name":"users","value":"343","yLabel":"GB","xLabel":"17"}],[{"name":"users","value":"52","yLabel":"GB","xLabel":"18"}],[{"name":"users","value":"8","yLabel":"GB","xLabel":"19"}],[{"name":"users","value":"1","yLabel":"GB","xLabel":"20"}],[{"name":"users","value":"669","yLabel":"ID","xLabel":"0"}],[{"name":"users","value":"436","yLabel":"ID","xLabel":"1"}],[{"name":"users","value":"552","yLabel":"ID","xLabel":"2"}],[{"name":"users","value":"12624","yLabel":"ID","xLabel":"3"}],[{"name":"users","value":"93940","yLabel":"ID","xLabel":"4"}],[{"name":"users","value":"54422","yLabel":"ID","xLabel":"5"}],[{"name":"users","value":"8758","yLabel":"ID","xLabel":"6"}],[{"name":"users","value":"718","yLabel":"ID","xLabel":"7"}],[{"name":"users","value":"548","yLabel":"IN","xLabel":"0"}],[{"name":"users","value":"463","yLabel":"IN","xLabel":"1"}],[{"name":"users","value":"1303","yLabel":"IN","xLabel":"2"}],[{"name":"users","value":"56457","yLabel":"IN","xLabel":"3"}],[{"name":"users","value":"270560","yLabel":"IN","xLabel":"4"}],[{"name":"users","value":"134274","yLabel":"IN","xLabel":"5"}],[{"name":"users","value":"12167","yLabel":"IN","xLabel":"6"}],[{"name":"users","value":"617","yLabel":"IN","xLabel":"7"}],[{"name":"users","value":"8","yLabel":"IN","xLabel":"8"}],[{"name":"users","value":"1","yLabel":"IN","xLabel":"14"}],[{"name":"users","value":"1264","yLabel":"IT","xLabel":"0"}],[{"name":"users","value":"2159","yLabel":"IT","xLabel":"1"}],[{"name":"users","value":"3990","yLabel":"IT","xLabel":"2"}],[{"name":"users","value":"34733","yLabel":"IT","xLabel":"3"}],[{"name":"users","value":"245227","yLabel":"IT","xLabel":"4"}],[{"name":"users","value":"447661","yLabel":"IT","xLabel":"5"}],[{"name":"users","value":"447428","yLabel":"IT","xLabel":"6"}],[{"name":"users","value":"70753","yLabel":"IT","xLabel":"7"}],[{"name":"users","value":"23398","yLabel":"IT","xLabel":"8"}],[{"name":"users","value":"8665","yLabel":"IT","xLabel":"9"}],[{"name":"users","value":"2726","yLabel":"IT","xLabel":"10"}],[{"name":"users","value":"652","yLabel":"IT","xLabel":"11"}],[{"name":"users","value":"57","yLabel":"IT","xLabel":"12"}],[{"name":"users","value":"295","yLabel":"JP","xLabel":"0"}],[{"name":"users","value":"430","yLabel":"JP","xLabel":"1"}],[{"name":"users","value":"1286","yLabel":"JP","xLabel":"2"}],[{"name":"users","value":"14980","yLabel":"JP","xLabel":"3"}],[{"name":"users","value":"54829","yLabel":"JP","xLabel":"4"}],[{"name":"users","value":"47119","yLabel":"JP","xLabel":"5"}],[{"name":"users","value":"4291","yLabel":"JP","xLabel":"6"}],[{"name":"users","value":"1","yLabel":"JP","xLabel":"7"}],[{"name":"users","value":"894","yLabel":"MX","xLabel":"0"}],[{"name":"users","value":"296656","yLabel":"MX","xLabel":"1"}],[{"name":"users","value":"334146","yLabel":"MX","xLabel":"2"}],[{"name":"users","value":"160621","yLabel":"MX","xLabel":"3"}],[{"name":"users","value":"43201","yLabel":"MX","xLabel":"4"}],[{"name":"users","value":"2278","yLabel":"MX","xLabel":"5"}],[{"name":"users","value":"102","yLabel":"MX","xLabel":"6"}],[{"name":"users","value":"10","yLabel":"MX","xLabel":"7"}],[{"name":"users","value":"3","yLabel":"MX","xLabel":"8"}],[{"name":"users","value":"3","yLabel":"MX","xLabel":"9"}],[{"name":"users","value":"2","yLabel":"MX","xLabel":"11"}],[{"name":"users","value":"1","yLabel":"MX","xLabel":"12"}],[{"name":"users","value":"1","yLabel":"MX","xLabel":"13"}],[{"name":"users","value":"332","yLabel":"PH","xLabel":"0"}],[{"name":"users","value":"236","yLabel":"PH","xLabel":"1"}],[{"name":"users","value":"118","yLabel":"PH","xLabel":"2"}],[{"name":"users","value":"302","yLabel":"PH","xLabel":"3"}],[{"name":"users","value":"61810","yLabel":"PH","xLabel":"4"}],[{"name":"users","value":"47942","yLabel":"PH","xLabel":"5"}],[{"name":"users","value":"18076","yLabel":"PH","xLabel":"6"}],[{"name":"users","value":"4086","yLabel":"PH","xLabel":"7"}],[{"name":"users","value":"1349","yLabel":"PH","xLabel":"8"}],[{"name":"users","value":"215","yLabel":"PH","xLabel":"9"}],[{"name":"users","value":"2","yLabel":"PH","xLabel":"10"}],[{"name":"users","value":"1568","yLabel":"RU","xLabel":"0"}],[{"name":"users","value":"77904","yLabel":"RU","xLabel":"1"}],[{"name":"users","value":"818379","yLabel":"RU","xLabel":"2"}],[{"name":"users","value":"319247","yLabel":"RU","xLabel":"3"}],[{"name":"users","value":"31617","yLabel":"RU","xLabel":"4"}],[{"name":"users","value":"2969","yLabel":"RU","xLabel":"5"}],[{"name":"users","value":"323","yLabel":"RU","xLabel":"6"}],[{"name":"users","value":"19","yLabel":"RU","xLabel":"7"}],[{"name":"users","value":"1","yLabel":"RU","xLabel":"8"}],[{"name":"users","value":"1","yLabel":"RU","xLabel":"9"}],[{"name":"users","value":"1","yLabel":"RU","xLabel":"11"}],[{"name":"users","value":"7606","yLabel":"TH","xLabel":"0"}],[{"name":"users","value":"1238","yLabel":"TH","xLabel":"1"}],[{"name":"users","value":"1699","yLabel":"TH","xLabel":"2"}],[{"name":"users","value":"690483","yLabel":"TH","xLabel":"3"}],[{"name":"users","value":"18635","yLabel":"TH","xLabel":"4"}],[{"name":"users","value":"13","yLabel":"TH","xLabel":"5"}],[{"name":"users","value":"3","yLabel":"TH","xLabel":"6"}],[{"name":"users","value":"1209","yLabel":"TR","xLabel":"0"}],[{"name":"users","value":"1671","yLabel":"TR","xLabel":"1"}],[{"name":"users","value":"1803","yLabel":"TR","xLabel":"2"}],[{"name":"users","value":"94266","yLabel":"TR","xLabel":"3"}],[{"name":"users","value":"448077","yLabel":"TR","xLabel":"4"}],[{"name":"users","value":"15815","yLabel":"TR","xLabel":"5"}],[{"name":"users","value":"7041","yLabel":"TR","xLabel":"6"}],[{"name":"users","value":"15","yLabel":"TR","xLabel":"7"}],[{"name":"users","value":"232","yLabel":"UA","xLabel":"0"}],[{"name":"users","value":"839","yLabel":"UA","xLabel":"1"}],[{"name":"users","value":"326","yLabel":"UA","xLabel":"2"}],[{"name":"users","value":"821","yLabel":"UA","xLabel":"3"}],[{"name":"users","value":"119724","yLabel":"UA","xLabel":"4"}],[{"name":"users","value":"49659","yLabel":"UA","xLabel":"5"}],[{"name":"users","value":"234","yLabel":"UA","xLabel":"6"}],[{"name":"users","value":"1587","yLabel":"US","xLabel":"0"}],[{"name":"users","value":"41284","yLabel":"US","xLabel":"1"}],[{"name":"users","value":"132732","yLabel":"US","xLabel":"2"}],[{"name":"users","value":"1505652","yLabel":"US","xLabel":"3"}],[{"name":"users","value":"1872871","yLabel":"US","xLabel":"4"}],[{"name":"users","value":"1085502","yLabel":"US","xLabel":"5"}],[{"name":"users","value":"534137","yLabel":"US","xLabel":"6"}],[{"name":"users","value":"342821","yLabel":"US","xLabel":"7"}],[{"name":"users","value":"256894","yLabel":"US","xLabel":"8"}],[{"name":"users","value":"249592","yLabel":"US","xLabel":"9"}],[{"name":"users","value":"185581","yLabel":"US","xLabel":"10"}],[{"name":"users","value":"150765","yLabel":"US","xLabel":"11"}],[{"name":"users","value":"139026","yLabel":"US","xLabel":"12"}],[{"name":"users","value":"94317","yLabel":"US","xLabel":"13"}],[{"name":"users","value":"156991","yLabel":"US","xLabel":"14"}],[{"name":"users","value":"437068","yLabel":"US","xLabel":"15"}],[{"name":"users","value":"206506","yLabel":"US","xLabel":"16"}],[{"name":"users","value":"76706","yLabel":"US","xLabel":"17"}],[{"name":"users","value":"28358","yLabel":"US","xLabel":"18"}],[{"name":"users","value":"7263","yLabel":"US","xLabel":"19"}],[{"name":"users","value":"1248","yLabel":"US","xLabel":"20"}],[{"name":"users","value":"136","yLabel":"US","xLabel":"21"}],[{"name":"users","value":"10","yLabel":"US","xLabel":"22"}],[{"name":"users","value":"2","yLabel":"US","xLabel":"23"}]],"dimensions":3,"yAxisLabel":"country","xAxisLabel":"aas_received"},
      threeDimensionB: {"name":"sign_dist","title":"Distribution of Total Signatures","created_at":"2013-12-24","description":"tbd","chartType":"table","location":"./queries/sign_dist.sql","query":"SELECT \n  u.country\n  , CASE\n      WHEN e.total_signature_count = 0                                              THEN 0\n      WHEN e.total_signature_count > 0       AND e.total_signature_count <= 10      THEN 1\n      WHEN e.total_signature_count > 10      AND e.total_signature_count <= 100     THEN 10\n      WHEN e.total_signature_count > 100     AND e.total_signature_count <= 1000    THEN 100\n      WHEN e.total_signature_count > 1000    AND e.total_signature_count <= 10000   THEN 1000\n      WHEN e.total_signature_count > 10000   AND e.total_signature_count <= 100000  THEN 10000\n      WHEN e.total_signature_count > 100000  AND e.total_signature_count <= 1000000 THEN 100000\n      WHEN e.total_signature_count > 1000000                                        THEN 1000000\n    END AS range\n, COUNT(1) AS petitions\nFROM events e\nJOIN users u ON u.id = e.user_id\nWHERE e.status > 0\nAND e.created_at >= CURRENT_DATE - INTERVAL '1 YEAR'\nAND u.country IN ('US', 'CA', 'DE', 'ES', 'FR', 'GB', 'IT', 'BY', 'RU')\nGROUP BY u.country, range\nORDER BY u.country, range;","rows":[[{"name":"petitions","value":"166","yLabel":"BY","xLabel":0}],[{"name":"petitions","value":"201","yLabel":"BY","xLabel":1}],[{"name":"petitions","value":"50","yLabel":"BY","xLabel":10}],[{"name":"petitions","value":"41","yLabel":"BY","xLabel":100}],[{"name":"petitions","value":"23","yLabel":"BY","xLabel":1000}],[{"name":"petitions","value":"5","yLabel":"BY","xLabel":10000}],[{"name":"petitions","value":"3027","yLabel":"CA","xLabel":0}],[{"name":"petitions","value":"4681","yLabel":"CA","xLabel":1}],[{"name":"petitions","value":"1352","yLabel":"CA","xLabel":10}],[{"name":"petitions","value":"863","yLabel":"CA","xLabel":100}],[{"name":"petitions","value":"275","yLabel":"CA","xLabel":1000}],[{"name":"petitions","value":"35","yLabel":"CA","xLabel":10000}],[{"name":"petitions","value":"3","yLabel":"CA","xLabel":100000}],[{"name":"petitions","value":"1","yLabel":"CA","xLabel":null}],[{"name":"petitions","value":"1690","yLabel":"DE","xLabel":0}],[{"name":"petitions","value":"2378","yLabel":"DE","xLabel":1}],[{"name":"petitions","value":"588","yLabel":"DE","xLabel":10}],[{"name":"petitions","value":"436","yLabel":"DE","xLabel":100}],[{"name":"petitions","value":"219","yLabel":"DE","xLabel":1000}],[{"name":"petitions","value":"68","yLabel":"DE","xLabel":10000}],[{"name":"petitions","value":"2","yLabel":"DE","xLabel":100000}],[{"name":"petitions","value":"2","yLabel":"DE","xLabel":null}],[{"name":"petitions","value":"10507","yLabel":"ES","xLabel":0}],[{"name":"petitions","value":"18060","yLabel":"ES","xLabel":1}],[{"name":"petitions","value":"4990","yLabel":"ES","xLabel":10}],[{"name":"petitions","value":"2701","yLabel":"ES","xLabel":100}],[{"name":"petitions","value":"836","yLabel":"ES","xLabel":1000}],[{"name":"petitions","value":"204","yLabel":"ES","xLabel":10000}],[{"name":"petitions","value":"34","yLabel":"ES","xLabel":100000}],[{"name":"petitions","value":"1","yLabel":"ES","xLabel":1000000}],[{"name":"petitions","value":"5","yLabel":"ES","xLabel":null}],[{"name":"petitions","value":"3966","yLabel":"FR","xLabel":0}],[{"name":"petitions","value":"5490","yLabel":"FR","xLabel":1}],[{"name":"petitions","value":"1294","yLabel":"FR","xLabel":10}],[{"name":"petitions","value":"865","yLabel":"FR","xLabel":100}],[{"name":"petitions","value":"294","yLabel":"FR","xLabel":1000}],[{"name":"petitions","value":"106","yLabel":"FR","xLabel":10000}],[{"name":"petitions","value":"4","yLabel":"FR","xLabel":100000}],[{"name":"petitions","value":"4","yLabel":"FR","xLabel":null}],[{"name":"petitions","value":"5375","yLabel":"GB","xLabel":0}],[{"name":"petitions","value":"8974","yLabel":"GB","xLabel":1}],[{"name":"petitions","value":"2740","yLabel":"GB","xLabel":10}],[{"name":"petitions","value":"1543","yLabel":"GB","xLabel":100}],[{"name":"petitions","value":"519","yLabel":"GB","xLabel":1000}],[{"name":"petitions","value":"104","yLabel":"GB","xLabel":10000}],[{"name":"petitions","value":"12","yLabel":"GB","xLabel":100000}],[{"name":"petitions","value":"5","yLabel":"GB","xLabel":null}],[{"name":"petitions","value":"3540","yLabel":"IT","xLabel":0}],[{"name":"petitions","value":"5636","yLabel":"IT","xLabel":1}],[{"name":"petitions","value":"1903","yLabel":"IT","xLabel":10}],[{"name":"petitions","value":"870","yLabel":"IT","xLabel":100}],[{"name":"petitions","value":"282","yLabel":"IT","xLabel":1000}],[{"name":"petitions","value":"102","yLabel":"IT","xLabel":10000}],[{"name":"petitions","value":"6","yLabel":"IT","xLabel":100000}],[{"name":"petitions","value":"1","yLabel":"IT","xLabel":null}],[{"name":"petitions","value":"2231","yLabel":"RU","xLabel":0}],[{"name":"petitions","value":"3120","yLabel":"RU","xLabel":1}],[{"name":"petitions","value":"586","yLabel":"RU","xLabel":10}],[{"name":"petitions","value":"427","yLabel":"RU","xLabel":100}],[{"name":"petitions","value":"176","yLabel":"RU","xLabel":1000}],[{"name":"petitions","value":"45","yLabel":"RU","xLabel":10000}],[{"name":"petitions","value":"4","yLabel":"RU","xLabel":100000}],[{"name":"petitions","value":"31155","yLabel":"US","xLabel":0}],[{"name":"petitions","value":"51406","yLabel":"US","xLabel":1}],[{"name":"petitions","value":"14264","yLabel":"US","xLabel":10}],[{"name":"petitions","value":"8127","yLabel":"US","xLabel":100}],[{"name":"petitions","value":"2320","yLabel":"US","xLabel":1000}],[{"name":"petitions","value":"512","yLabel":"US","xLabel":10000}],[{"name":"petitions","value":"89","yLabel":"US","xLabel":100000}],[{"name":"petitions","value":"25","yLabel":"US","xLabel":null}]],"dimensions":3,"yAxisLabel":"country","xAxisLabel":"range"},
      oneDimensionC: {"name":"matrix", "rows": [[{"name":"n","value":1},{"name":"n","value":2},{"name":"n","value":3}],[{"name":"n","value":4},{"name":"n","value":5},{"name":"n","value":6}],[{"name":"n","value":7},{"name":"n","value":8},{"name":"n","value":9}]]},
      twoDimensionC: {"name":"matrix", "rows": [[{"name":"n","value":1, "xLabel":"first"},{"name":"n","value":2,"xLabel":"second"},{"name":"n","value":3,"xLabel":"third"}],[{"name":"n","value":4, "xLabel":"first"},{"name":"n","value":5, "xLabel":"second"},{"name":"n","value":6, "xLabel":"third"}],[{"name":"n","value":7, "xLabel":"first"},{"name":"n","value":8, "xLabel":"second"},{"name":"n","value":9, "xLabel":"third"}]]},
      threeDimensionD: {"name":"matrix", "rows": [[{"name":"n","value":1, "xLabel":"first", "yLabel":"one"},{"name":"n","value":2,"xLabel":"second", "yLabel":"one"},{"name":"n","value":3,"xLabel":"third", "yLabel":"one"}],[{"name":"n","value":4, "xLabel":"first", "yLabel":"two"},{"name":"n","value":5, "xLabel":"second", "yLabel":"two"},{"name":"n","value":6, "xLabel":"third", "yLabel":"two"}],[{"name":"n","value":7, "xLabel":"first", "yLabel":"three"},{"name":"n","value":8, "xLabel":"second", "yLabel":"three"},{"name":"n","value":9, "xLabel":"third", "yLabel":"three"}]]}
    })
  });
};