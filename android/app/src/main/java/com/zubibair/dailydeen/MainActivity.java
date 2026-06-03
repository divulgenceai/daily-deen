package com.zubibair.dailydeen;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestHighestRefreshRate();
        tuneWebView();
    }

    @Override
    public void onResume() {
        super.onResume();
        requestHighestRefreshRate();
        tuneWebView();
    }

    private void tuneWebView() {
        if (getBridge() == null) return;

        WebView webView = getBridge().getWebView();
        if (webView == null) return;

        webView.setBackgroundColor(Color.rgb(2, 6, 4));
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(false);
        webView.getSettings().setTextZoom(100);
    }

    private void requestHighestRefreshRate() {
        Display display = getActivityDisplay();
        if (display == null) return;

        Display.Mode currentMode = display.getMode();
        Display.Mode bestMatchingMode = currentMode;

        for (Display.Mode mode : display.getSupportedModes()) {
            boolean sameResolution =
                mode.getPhysicalWidth() == currentMode.getPhysicalWidth()
                    && mode.getPhysicalHeight() == currentMode.getPhysicalHeight();

            if (sameResolution && mode.getRefreshRate() > bestMatchingMode.getRefreshRate()) {
                bestMatchingMode = mode;
            }
        }

        WindowManager.LayoutParams attributes = getWindow().getAttributes();
        attributes.preferredDisplayModeId = bestMatchingMode.getModeId();
        attributes.preferredRefreshRate = bestMatchingMode.getRefreshRate();
        getWindow().setAttributes(attributes);
    }

    @SuppressWarnings("deprecation")
    private Display getActivityDisplay() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            return getDisplay();
        }

        return getWindowManager().getDefaultDisplay();
    }
}
