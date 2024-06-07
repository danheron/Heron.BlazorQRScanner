using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Heron.BlazorQRScanner;

public partial class Scanner : IAsyncDisposable
{
    private readonly Lazy<Task<IJSObjectReference>> _moduleTask;

    private IJSObjectReference? _scanner;
    private ElementReference _canvasElement;
    private DotNetObjectReference<Scanner>? _this;

    [Parameter]
    public bool AutoStart { get; set; } = true;

    [Parameter]
    public bool AutoStop { get; set; } = true;
    
    [Parameter]
    public EventCallback<string> CodeFound { get; set; }

    public Scanner()
    {
        _moduleTask = new Lazy<Task<IJSObjectReference>>(() => JsRuntime
            .InvokeAsync<IJSObjectReference>(
                "import", Version.GetLink("./_content/Heron.BlazorQRScanner/Heron.BlazorQRScanner.js")).AsTask());
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);

        if (firstRender && AutoStart)
        {
            await Start();
        }
    }

    public async Task Start()
    {
        var module = await _moduleTask.Value;
        _scanner = await module.InvokeAsync<IJSObjectReference>("createScanner");

        _this ??= DotNetObjectReference.Create(this);
        await _scanner.InvokeVoidAsync("start", _canvasElement, _this);
    }

    public async Task Stop()
    {
        if (_scanner == null) return;

        await _scanner.InvokeVoidAsync("stop");
    }

    [JSInvokable]
    public async Task ScanResult(string code)
    {
        try
        {
            if (AutoStop) await Stop();
            
            await CodeFound.InvokeAsync(code);
        }
        catch (JSException ex)
        {
            if (ex.Message == "MediaDevicesNotFound")
            {
                throw new InvalidOperationException(
                    "Media Devices is undefined. This can happen if the web page is called without ssl.");
            }

            throw;
        }
    }

    public async ValueTask DisposeAsync()
    {
        GC.SuppressFinalize(this);

        if (_scanner != null)
        {
            await Stop();
            await _scanner.DisposeAsync();
            _scanner = null;
        }
        
        _this?.Dispose();
        
        if (_moduleTask.IsValueCreated)
        {
            _moduleTask.Value.Dispose();
        }
    }
}