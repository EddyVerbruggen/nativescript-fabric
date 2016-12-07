import * as application from 'application';
import { Android } from "./fabric.common";

declare var io: any, com: any;
class CrashlyticsAndroidPlugin implements Android {

    constructor() {
    }

    init() {
        if (application.android) {
            application.android.on('activityStarted', activityEventData => {
                // Enable Fabric crash reporting
                io.fabric.sdk.android.Fabric.with(activityEventData.activity, [new com.crashlytics.android.Crashlytics()]);
            });
            application.on('uncaughtError', args => {
                var error = args.android || args.ios;
                if (error.nativeException) {
                    error = {
                        name: error.name,
                        message: error.message,
                        stack: error.stackTrace
                    };
                }
                com.crashlytics.android.Crashlytics.logException(error);
            });
        }
    }
}

export function CrashlyticsPlugin():Android {
    return new CrashlyticsAndroidPlugin();
}