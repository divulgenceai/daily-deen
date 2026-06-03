package com.zubibair.dailydeen;

import android.os.Bundle;
import android.view.Display;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestHighestRefreshRate();
    }

    @Override
    public void onResume() {
        super.onResume();
        requestHighestRefreshRate();
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
