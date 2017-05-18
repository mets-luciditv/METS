<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:tei='http://www.tei-c.org/ns/1.0' version='1.0' exclude-result-prefixes="tei">
    <xsl:output method="html" indent="yes" encoding="UTF-8"  />
    <xsl:param name="jing_id"/>
    <xsl:template match="tei:div[@type='volume']">
        <div class='volume'>
            <xsl:attribute name="data-volumeId">
                <xsl:value-of select="./@xml:id"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="tei:pb">
    <xsl:variable name="page_id" select="./@xml:id" />
        <span class="pb">
    <xsl:attribute name="data-pageId">
        <xsl:value-of select="./@xml:id"/>
    </xsl:attribute>
            <img src="{concat('images/',$jing_id,'/',$page_id,'.jpg')}" style="width:100%;"></img>
</span>
</xsl:template>
    <xsl:template match="tei:div[@type='volume']/tei:div">
    <div><xsl:apply-templates/></div>
</xsl:template>
    <xsl:template match="tei:div[@type='volume']/tei:div/tei:head">
        <h3 class="head"><xsl:apply-templates/></h3>
    </xsl:template>
    <xsl:template match="tei:p">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match='tei:lb'>
        <xsl:if test="position() &gt; 2">
            <br class="lb_br"></br>
        </xsl:if>
        <span class="lb">
            <xsl:attribute name="data-lineid">
                <xsl:value-of select="./@xml:id"/>
            </xsl:attribute>
        </span>
    </xsl:template>
    <xsl:template match='tei:span'>
        <span>
            <xsl:for-each select="@*">
                <xsl:attribute name="{name()}">
                    <xsl:value-of select="."/>
                </xsl:attribute>
            </xsl:for-each>
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    <!--<xsl:template match='tei:p' >
        <p class="paragraph">
          <xsl:for-each select="@*">
                <xsl:attribute name="{name()}">
                    <xsl:value-of select="."/>
                </xsl:attribute>
            </xsl:for-each>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match="tei:span">
        <span>
        <xsl:for-each select="@*">
            <xsl:attribute name="{name()}">
                <xsl:value-of select="."/>
            </xsl:attribute>
        </xsl:for-each>
            <xsl:value-of select="."/>
        </span>
    </xsl:template>
    <xsl:template match='tei:title'>
        <p class="title">

            <xsl:for-each select="@*">
                <xsl:attribute name="{name()}">
                    <xsl:value-of select="."/>
                </xsl:attribute>
            </xsl:for-each>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match='tei:lb'>
        <br class="lb_br"></br>
        <span class="lb">
            <xsl:attribute name="data-lineid">
                <xsl:value-of select="./@xml:id"/>
            </xsl:attribute>
        </span>
    </xsl:template>
    <xsl:template match='tei:p/tei:lb'>
        <xsl:if test="position() &gt; 2">
            <br class="lb_br"></br>
        </xsl:if>
        <span class="lb">
            <xsl:attribute name="data-lineid">
                <xsl:value-of select="./@xml:id"/>
            </xsl:attribute>
        </span>
    </xsl:template>
    <xsl:template match='tei:title/tei:lb'>
        <xsl:if test="position() &gt; 4">
            <br class="lb_br"></br>
        </xsl:if>
        <span class="lb">
            <xsl:attribute name="data-lineid">
                <xsl:value-of select="./@xml:id"/>
            </xsl:attribute>
        </span>
        
    </xsl:template>
	<xsl:template match="tei:pb">
		<hr>
		    <xsl:for-each select="@*">
		        <xsl:attribute name="{name()}">
		            <xsl:value-of select="."/>
		        </xsl:attribute>
		    </xsl:for-each>
		</hr>
	</xsl:template>
    <xsl:template match="tei:em" name="hl">
        <em>
            <xsl:for-each select="@*">
                <xsl:attribute name="{name()}">
                    <xsl:value-of select="."/>
                </xsl:attribute>
            </xsl:for-each>
            <xsl:apply-templates/>
        </em>
    </xsl:template>
    <xsl:template match="tei:TEI">
        <xsl:apply-templates/>
    </xsl:template>-->
</xsl:stylesheet>