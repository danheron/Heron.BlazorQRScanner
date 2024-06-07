namespace Heron.BlazorQRScanner;

public static class Version
{
    private static string _version = string.Empty;

    private static string GetVersion()
    {
        if (!string.IsNullOrEmpty(_version)) return _version;

#if DEBUG
        _version = DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() +
                   DateTime.Now.Second.ToString();
#else
        var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
        _version = version == null ? "1" : version.ToString();
#endif
        return _version;
    }

    public static string GetLink(string url)
    {
        return $"{url}?v={GetVersion()}";
    }
}