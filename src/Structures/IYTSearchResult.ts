interface RootResponse
{
    kind?: string;
    etag?: string;
    nextPageToken?: string;
    regionCode ?: string;

    pageInfo?: PageInfo;
    items?: Array<YoutubeItem>;
}

interface PageInfo
{
    totalResults?: number;
    resultsPerPage?: number;
}

interface YoutubeID
{
    kind?: string;
    videoId: string;
}

interface YoutubeSnippet
{
    channelId?: string;
    title?: string;
    description?: string;
    channelTitle?: string;
    liveBroadcastContent?: string;
}

interface YoutubeItem 
{
    kind?: string;
    etag?: string;
    id: YoutubeID;
    snippet: YoutubeSnippet;
}