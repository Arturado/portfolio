import nh3

ALLOWED_TAGS = {
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "em", "b", "i", "u", "s", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "span", "div",
}

ALLOWED_ATTRIBUTES = {
    "a": {"href", "title", "target"},
    "img": {"src", "alt", "title", "width", "height"},
    "span": {"class"},
    "div": {"class"},
    "td": {"colspan", "rowspan"},
    "th": {"colspan", "rowspan"},
}


def sanitize_html(content: str) -> str:
    return nh3.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        link_rel="noopener noreferrer nofollow",
    )


def strip_html(content: str) -> str:
    return nh3.clean(content, tags=set())
