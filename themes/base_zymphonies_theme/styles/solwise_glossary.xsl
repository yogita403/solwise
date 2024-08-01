<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Solwise - Technical Glossary</title>
	
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	
	<link href="styles/html5reset/reset.css" media="all" rel="stylesheet" title="CSS" type="text/css" />
	<link href="styles/layout.css" media="all" rel="stylesheet" title="CSS" type="text/css" />
	<link href="styles/nav.css" media="all" rel="stylesheet" title="CSS" type="text/css" />
	<link href="styles/style.css" media="all" rel="stylesheet" title="CSS" type="text/css" />
	<link href="styles/style_print.css" media="print" rel="stylesheet" title="CSS" type="text/css" />
	
	<script type="text/javascript" src="includes/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="includes/solwise_menusystem.js"></script>
	
	<style type="text/css">
	ul, p {
		display: block;
	}
	ul {
		padding-left: 40px;
		list-style: disc outside none;
		color: #333;
	}
	li {
		display: list-item;
	}
	</style>
</head>
<body>
<header>
	<div class="wrapper absolute">
		<a href="index.html" id="companylogo"><img src="images/logo.png" alt="Solwise" /></a>
		<div class="links">
			<a href="sitemap.htm">Site Map</a> | 
			<a href="https://secure.solwise.co.uk/login.php">Login</a> | 
			<a href="https://secure.solwise.co.uk/trolley.php" target="SolwiseOrderWindow">View Trolley</a>
		</div>
	</div>
</header>
<section id="body">
	<div class="wrapper">
		<section class="side">
			<nav id="sidemenu">
				<ul>
				<xsl:for-each select="glossary/entry">
				<xsl:sort select="@name" />
					<li>
						<a><xsl:attribute name="href">#<xsl:value-of select="position()" /></xsl:attribute>
							<xsl:value-of select="@name"/>
						</a>
					</li>
				</xsl:for-each>
				</ul>
			</nav>
		</section>
		<section class="main">
			<h1>Solwise Technical Glossary</h1>

			<xsl:for-each select="glossary/entry">
			<xsl:sort select="@name" />
			<h2><xsl:attribute name="id"><xsl:value-of select="position()" /></xsl:attribute>
				<xsl:value-of select="@name"/>
			</h2>
			<h3>Keywords:</h3>
			<xsl:for-each select="keyword">
				"<xsl:value-of select="."/>", 
			</xsl:for-each>
			<h3>Definition:</h3>
			<xsl:copy-of select="definition/*"/>
			
			</xsl:for-each>
		</section>
	</div>
</section>
</body>
</html>
</xsl:template>
</xsl:stylesheet>