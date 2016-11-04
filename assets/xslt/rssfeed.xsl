<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />
  <xsl:variable name="title" select="/rss/channel/title"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>
          <xsl:value-of select="$title"/> RSS/XML Feed
        </title>
        <style>
          body{background-color:#fff;border:0px;margin:10px;font-family:Verdana,Arial,Helvetica,sans-serif,"MS sans serif";font-size:80%;font-weight:normal;color:#000000;}
          form{margin:0px;padding:0px;}
          h2{margin:0px;padding:5px 0px;font-size:140%;}
          p{margin:0px;padding:5px 0px;}
          a:link{text-decoration:none;font-size:100%;color:#000099;}
          a:visited{text-decoration:none;font-size:100%;color:#6666CC;}
          a:active{text-decoration:none;font-size:100%;color:#000099;}
          a:hover{font-size:100%;color:#000099;text-decoration:underline;}
          a.item:link{font-weight:bold;}
          a.item:visited{font-weight:bold;}
          a.item:active{font-weight:bold;}
          a.item:hover{font-weight:bold;}
          .topbox{width:100%;}
          .banbox{width:100%;background:url("http://newsimg.bbc.co.uk/shared/bsp/xsl/rss/img/boxbar.gif") repeat-x;}
          .mainbox{width:100%;background:url("http://newsimg.bbc.co.uk/shared/bsp/xsl/rss/img/boxbar2.gif") repeat-x;padding-top:10px;}
          .itembox{width:62%;float:left;padding-top:10px;}
          .rhsbox{border-left:1px dashed #999;width:36%;float:right;}
          #item ul {list-style:none;margin:0px;padding:0px;border:none;}
          #item li {margin:0;padding:5px 0px;}
          .rhsbox ul {list-style-type:disc;margin:0px 20px;padding:0px;border:none;}
          .rhsbox li {margin:0;padding:5px 0px;}
          .padtopbox{padding:10px;border:1px solid #999;}
          .paditembox{padding:10px 5px 10px 10px;}
          .padbanbox{padding:20px 10px 10px 10px;}
          .padrhsbox{padding:10px 0px 20px 10px;}
          .subhead{font-weight:bold;}
          .disclaim{font-size:11px;color:#999;}
          .mvb{margin-bottom:5px;}
          .fltl{float:left;}
          .fltclear{clear:both;}
        </style>
      </head>
    <xsl:apply-templates select="rss/channel"/>
    </html>
  </xsl:template>
  <xsl:template match="channel">
    <body>
      <div class="topbox">
        <div class="padtopbox">
          <h2>What is this page?</h2>
          <p>This is an RSS feed from the <xsl:value-of select="image/title" /> website. RSS feeds allow you to stay up to date with the latest news and features you want from  <xsl:value-of select="image/title" />.</p>
          <p>To subscribe to it, you will need a News Reader or other similar device.</p>
        </div>
      </div>
      <div class="banbox">
        <div class="padbanbox">
          <div class="mvb">
            <div class="fltl">
              <span class="subhead">RSS Feed For: </span>
            </div>
            <a href="#" class="item">
              <img height="16" hspace="5" vspace="0" border="0" width="16" alt="RSS feed" src="https://amdouglas.com/asset/img/feed.gif" title="RSS feed" align="left" />
              <xsl:value-of select="$title"/>
            </a>
            <br clear="all" />
          </div>
          <div class="fltclear">Below is the latest content available from this feed.
        </div>
      </div>
    </div>
    <div class="mainbox">
      <div class="itembox">
        <div class="paditembox">
          <xsl:apply-templates select="item"/>
        </div>
      </div>
      <div class="rhsbox">
        <div class="padrhsbox">
          <h2>Subscribe to this feed</h2>
          <p>You can subscribe to this RSS feed in a number of ways, including the following:</p>
          <ul>
          <li>Drag the orange RSS button into your News Reader</li>
          <li>Drag the URL of the RSS feed into your News Reader</li>
          <li>Cut and paste the URL of the RSS feed into your News Reader</li>
          </ul>
          </div>
        </div>
      </div>
    </body>
  </xsl:template>
  <xsl:template match="item">
    <div id="item">
      <ul>
        <li>
          <a href="{link}" class="item">
            <xsl:value-of disable-output-escaping="yes" select="title"/>
          </a>
          <br/>
          <div>
            <xsl:value-of disable-output-escaping="yes" select="description" />
          </div>
        </li>
      </ul>
    </div>
  </xsl:template>
</xsl:stylesheet>
