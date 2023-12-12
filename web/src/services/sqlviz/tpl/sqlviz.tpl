digraph name {
  bgcolor = "transparent"
  splines = ortho
  fontname = "Helvetica"
  fontsize = 12

  node [
    fontname = "Helvetica"
    fontsize = 12
    shape = "plaintext"
  ]
   edge [
    fontname = "Helvetica"
    fontsize = 12
  ]

  {% for model in models %}
    {% for relation in model.relations %}
    {{ relation.target }} [label=<
        <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" ALIGN="left">
        <TR><TD BGCOLOR="Lavender" COLSPAN="2" CELLPADDING="4" ALIGN="CENTER"
        ><FONT FACE="Helvetica-Bold"
        >{{ relation.target }}</FONT></TD></TR>
        </TABLE>
        >]
    {{ model.id }} -> {{ relation.target }};
    {% endfor %}
  {% endfor %}

  {% for model in models %}
    {{ model.id }} [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" ALIGN="left">
     <TR><TD BGCOLOR="Lavender" COLSPAN="2" CELLPADDING="4" ALIGN="CENTER"
     ><FONT FACE="Helvetica-Bold"
     >{{ model.name }}</FONT></TD></TR>

    {% if not disableFields %}
        {% for field in model.fields %}
        <TR><TD ALIGN="LEFT" BGCOLOR="White" 
        ><FONT {% if field.blank %}COLOR="#7B7B7B" {% endif %}FACE="Helvetica">{{ field.name }}</FONT
        ></TD>
        <TD ALIGN="LEFT" BGCOLOR="White" 
        ><FONT {% if field.blank %}COLOR="#7B7B7B" {% endif %}FACE="Helvetica">{{ field.type }}</FONT
        ></TD></TR>
        {% endfor %}
    {% endif %}
    </TABLE>
    >]
  {% endfor %}
}
