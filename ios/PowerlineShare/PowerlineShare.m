#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import "React/RCTBundleURLProvider.h"
#import "React/RCTRootView.h"
#import <React/RCTLog.h>

@interface PowerlineShare : ReactNativeShareExtension
@end

@implementation PowerlineShare

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"PowerlineShare"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;
  return rootView;
}

@end
