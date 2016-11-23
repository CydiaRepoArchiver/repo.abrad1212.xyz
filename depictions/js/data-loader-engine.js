function Data_Loader_Engine(contentBlocks, xml)
{
    $.each(contentBlocks, function (key, contentInfo) 
    {
        //console.log("Processing " + key);
        //console.log("Type " + contentInfo.type);
        
        if (!($(key).length)) { return }
        
        switch (contentInfo.type)
        {
            case "text":
                console.log("Type: --TEXT--");
                console.log("Text: " + $(xml).find(contentInfo.source).text());
                
                var content = $(xml).find(contentInfo.source).text();
                $(key).html(content)
                
                console.log(content + " <---");
                
                break;
            case "link":
                console.log("URL: " + contentInfo.url);
                console.log("Text: " + contentInfo.text);
                
                var url = contentInfo.url;
                var params = [];
                
                if (contentInfo.params)
                {
                    $.each(contentInfo.params, function() {
                        this[1] = escape(this[1]);
                        params[params.length] = this.join("=");
                    });
                }
                
                url = url + "?" + params.join("&");
                $(key).append( $("<a></a>")
                        .attr("href", url)
                        .text(contentInfo.text)
                );
                
                break;
            case "list":
                var list = $(xml).find(contentInfo.source);
                
                console.log("LIST TEXT: " + list.text());
                
                if (list.size() == 0)
                {
                    if (contentInfo.emptyListCallback)
                    {
                        contentInfo.emptyListCallback($(key))
                    }
                }
                else
                {
                    if (!!contentInfo.reverseRender)
                    {
                        list = $(list).get().reverse();
                    }
                    $.each(list, function (index, value) {
                        var item = $(value).text()
                        
                        if (!!contentInfo.reverseRender)
                        {
                            $(key).prepend($(contentInfo.paragraphElement).html("<p>"+ item + "</p>"))
                        }
                        else
                        {
                            $(key).append($(contentInfo.paragraphElement).html("<p>" + item + "</p>"))
                        }
                        
                    });
                }
                break;
            case "articles":
                var articles = $(xml).find(contentInfo.source).children();
                var titleID = 0;
                
                $.each(articles, function (index, article) {
                    var articleTitle = $(article).find(contentInfo.titleSource).text() 
                    $(key).append($(contentInfo.titleElement).html(articleTitle));
                    
                    var container = $(contentInfo.paragraphContainer).attr("id", ++titleID);
                    $(key).append($(container));
                    
                    $.each($(article).find(contentInfo.paragraphSource), function(index, paragraph) {
                        $(container).append($(contentInfo.paragraphElement).html("<p>" + $(paragraph).text() + "</p>")) 
                    });
                });
                
                break;
            case "custom":
                if (!key) { return }
                contentInfo.render( $(key), $(xml).find(contentInfo.source))
                
                break;
                
        } // End Switch Statement
        
    }); // End Each Statement
}