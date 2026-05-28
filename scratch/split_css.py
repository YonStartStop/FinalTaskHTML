import os

css_path = 'styles/myStyle.css'

if not os.path.exists(css_path):
    raise FileNotFoundError(f"Could not find {css_path}")

with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_block(start, end):
    # line numbers are 1-based, list is 0-based
    return "".join(lines[start-1:end])

# --- 1. styles/common.css ---
common_content = f"""/* ==========================================================================
   COMMON SHARED STYLES
   ========================================================================== */

{get_block(1, 637)}

{get_block(965, 990)}

{get_block(1215, 1234)}

@media (max-width: 991px) {{
{get_block(1241, 1244)}
}}

@media (max-width: 767px) {{
{get_block(1260, 1302)}

{get_block(1392, 1420)}
}}

{get_block(1422, 1473)}

@media (max-width: 991px) {{
{get_block(2513, 2521)}
}}
"""

# --- 2. styles/indexStyle.css ---
index_content = f"""/* ==========================================================================
   INDEX / HOME PAGE SPECIFIC STYLES
   ========================================================================== */

{get_block(638, 904)}

{get_block(905, 964)}

@media (max-width: 767px) {{
{get_block(1304, 1391)}
}}

{get_block(2331, 2508)}

@media (max-width: 576px) {{
{get_block(2663, 2670)}
}}

{get_block(4033, 4109)}

{get_block(4110, 4491)}
"""

# --- 3. styles/aboutStyle.css ---
about_content = f"""/* ==========================================================================
   ABOUT PAGE SPECIFIC STYLES
   ========================================================================== */

{get_block(1179, 1214)}

@media (max-width: 991px) {{
{get_block(1246, 1257)}
}}

{get_block(1474, 1561)}

@media (max-width: 991px) {{
{get_block(2523, 2526)}
}}
"""

# --- 4. styles/contactStyle.css ---
contact_content = f"""/* ==========================================================================
   CONTACT PAGE SPECIFIC STYLES
   ========================================================================== */

{get_block(2677, 2944)}
"""

# --- 5. styles/layersStyle.css ---
layers_content = f"""/* ==========================================================================
   3-LAYERS LAW PAGE SPECIFIC STYLES
   ========================================================================== */

{get_block(1562, 1775)}

@media (max-width: 991px) {{
{get_block(2528, 2544)}
}}

@media (max-width: 576px) {{
{get_block(2672, 2674)}
}}

{get_block(2945, 4032)}
"""

# --- 6. styles/toolsStyle.css ---
tools_content = f"""/* ==========================================================================
   TOOLS & RECOMMENDATIONS PAGE SPECIFIC STYLES
   ========================================================================== */

{get_block(991, 1178)}

{get_block(1776, 1855)}

{get_block(1856, 2330)}

@media (max-width: 991px) {{
{get_block(2546, 2606)}
}}

@media (max-width: 576px) {{
{get_block(2610, 2661)}
}}
"""

# --- 7. styles/topicPageStyle.css ---
topic_page_content = """/* ==========================================================================
   TOPIC DETAIL PAGE SPECIFIC STYLES
   ========================================================================== */

.chat {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    direction: rtl;
}

.chat-bubble.adult {
    background-color: var(--bubble-azure);
    border-radius: 26px;
    padding: 12px 22px;
    color: #1A2F4C;
    align-self: flex-start;
    position: relative;
    box-shadow: 0 6px 14px rgba(54, 82, 122, 0.08);
}

.chat-bubble.adult::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: var(--bubble-azure);
    transform: rotate(45deg);
    border-radius: 3px;
    bottom: -6px;
    left: 28px;
}

.chat-bubble.kid {
    align-self: flex-end;
    background-color: #FFF5F9;
    border: 2px solid rgba(0, 0, 0, 0.04);
}

.chat-bubble.kid::after {
    background-color: #FFF5F9;
    bottom: -6px;
    right: 28px;
}

.card.indigo {
    background-color: var(--layer-2-color);
    color: var(--layer-2-text);
    padding: 20px;
    border-radius: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    line-height: 1.6;
}
"""

# Write all outputs
os.makedirs('styles', exist_ok=True)

with open('styles/common.css', 'w', encoding='utf-8') as f:
    f.write(common_content)

with open('styles/indexStyle.css', 'w', encoding='utf-8') as f:
    f.write(index_content)

with open('styles/aboutStyle.css', 'w', encoding='utf-8') as f:
    f.write(about_content)

with open('styles/contactStyle.css', 'w', encoding='utf-8') as f:
    f.write(contact_content)

with open('styles/layersStyle.css', 'w', encoding='utf-8') as f:
    f.write(layers_content)

with open('styles/toolsStyle.css', 'w', encoding='utf-8') as f:
    f.write(tools_content)

with open('styles/topicPageStyle.css', 'w', encoding='utf-8') as f:
    f.write(topic_page_content)

print("CSS split finished successfully!")
