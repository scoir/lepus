//
//  Nymble.m
//  esquive
//
//  Created by Kevin Griffin on 4/27/20.
//

#import "Nymble.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation Nymble

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getStruct:(RCTResponseSenderBlock)success error:(RCTResponseSenderBlock)error){
  NSError *err = nil;
  NSString *resp = NymbleReturnStruct(&err);
  
  if (err != nil) {
    error(@[[err description]]);
    return;
  }
  
  success(@[resp]);
}
RCT_EXPORT_METHOD(getString:(RCTResponseSenderBlock)success error:(RCTResponseSenderBlock)error){
  NSError *err = nil;
  NSString *resp = NymbleReturnWrappedValue(&err);
  
  if (err != nil) {
    error(@[[err description]]);
    return;
  }
  
  success(@[resp]);
}
RCT_EXPORT_METHOD(asyncHello:(RCTResponseSenderBlock)success){
  success(@[NymbleAsync(self)]);
}

-(void)sendEvent:(NSString*)channel message:(NSString*)message{
  [self.bridge.eventDispatcher sendDeviceEventWithName:channel body:message];
}

@end
