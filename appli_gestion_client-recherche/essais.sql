SELECT pwd FROM Password AS pwd

	 JOIN lnkCIToPrivatePassword AS ink ON ink.pwd_id = pwd.id
	 JOIN FunctionalCI AS fci ON ink.ci_id = fci.id
	 JOIN Organization AS org ON pwd.org_id = org.id
	 JOIN Environment AS env ON fci.environment_id = env.id
	 WHERE (env.name = "Développement")
	
	 AND (org.name = "BASTIDE CONFORT MEDICAL")
	 
	 
	 SELECT fci FROM FunctionalCI AS fci
	 JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = fci.id
	 JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id
	 JOIN Environment AS env ON aps.environment_id = env.id
	 JOIN Organization AS org ON aps.org_id = org.id
	  WHERE (env.name = "Développement")
	 AND (fci.finalclass="password" )
	 AND (org.name = "BASTIDE CONFORT MEDICAL")
	 
	 SELECT pdw FROM Password AS pwd
	 JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id
	 JOIN Environment AS env ON aps.environment_id = env.id
	 JOIN Organization AS org ON aps.org_id = org.id
	 WHERE (env.name = "Développement")
	 
//passwords	 
	 SELECT  pwd FROM Password AS pwd
 JOIN lnkCIToPublicPassword AS inkstoci ON inkstoci.pwd_id = pwd.id
 //JOIN FunctionalCI AS fci ON inkstoci.ci_id = fci.id 
 JOIN ApplicationSolution AS aps ON inkstoci.ci_id = aps.id
 JOIN Environment AS env ON aps.environment_id = env.id
 JOIN Organization AS org ON pwd.org_id = org.id
 WHERE(env.name = "Développement")
 
 
  JOIN Organization AS org ON inkstoci.org_id = org.id
  
  
  
  SELECT FunctionalCI AS fci
 JOIN lnkCIToPublicPassword AS inkstoci ON inkstoci.ci_id = fci.id
 JOIN lnkSolutionToCI AS inktoci ON inkstoci.ci_id = fci.id 
 JOIN ApplicationSolution AS aps ON inkstoci.ci_id = aps.id
 JOIN Environment AS env ON aps.environment_id = env.id
 WHERE(env.name = "Développement")
 
 
 
 MOT DE PASSE 
 
 SELECT  pwd FROM Password AS pwd
 JOIN lnkCIToPublicPassword AS inkstoci ON inkstoci.pwd_id = pwd.id
 
 JOIN ApplicationSolution AS aps ON inkstoci.ci_id = aps.id
 JOIN Environment AS env ON aps.environment_id = env.id
 JOIN Organization AS org ON aps.org_id = org.id
 WHERE (env.name = "Développement") AND (org.name = "FM LOGISTIC")
 
 
CI DU PASSWORD
 SELECT `lnkCIToPublicPassword` FROM lnkCIToPublicPassword AS `lnkCIToPublicPassword` 

JOIN PublicPassword AS `PublicPassword` ON `lnkCIToPublicPassword`.pwd_id = `PublicPassword`.id 

WHERE (`PublicPassword`.`id` = '3343') 
 