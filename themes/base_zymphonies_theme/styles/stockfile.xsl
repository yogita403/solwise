<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
	<title>Solwise Stockfile</title>
</head>
<body>
	<table border="1px">
		<tr>
			<th>Stockcode</th>
			<th>Description</th>
			<th>URI</th>
			<th>Stock Status</th>
			<th>Price</th>
			<th>Images</th>
			<th>Accessories</th>
		</tr>
		<xsl:for-each select="stockfile/stock">
		<xsl:sort select="@code" />
		<tr>
			<td><xsl:value-of select="@code" /></td>
			<td><xsl:value-of select="description" /></td>
			<td><xsl:value-of select="URI" /></td>
			<td><xsl:value-of select="status" /></td>
			<td><xsl:value-of select="price[@scope='retail']/break[@qty=1]" /></td>
			<td>
				<xsl:for-each select="image">
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="@src" />
						</xsl:attribute>
						<xsl:value-of select="@src" />
					</a>
					<br />
				</xsl:for-each>
			</td>
			<td>
				<xsl:for-each select="accessory">
					<xsl:variable name="ACode" select="." />
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="/stockfile/stock[@code=$ACode]/URI" />
						</xsl:attribute>
						<xsl:value-of select="." />
					</a>
					<br />
				</xsl:for-each>
			</td>
		</tr>
		</xsl:for-each>
	</table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>