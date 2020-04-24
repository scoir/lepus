// Objective-C API for talking to pkg/pkg Go package.
//   gobind -lang=objc pkg/pkg
//
// File is generated by gobind. Do not edit.

#ifndef __Pkg_H__
#define __Pkg_H__

@import Foundation;
#include "ref.h"
#include "Universe.objc.h"


@protocol PkgEventBus;
@class PkgEventBus;

@protocol PkgEventBus <NSObject>
- (void)sendEvent:(NSString* _Nullable)channel message:(NSString* _Nullable)message;
@end

FOUNDATION_EXPORT void PkgAsyncHelloWorld(id<PkgEventBus> _Nullable bus);

FOUNDATION_EXPORT NSString* _Nonnull PkgHelloWorld(void);

@class PkgEventBus;

@interface PkgEventBus : NSObject <goSeqRefInterface, PkgEventBus> {
}
@property(strong, readonly) _Nonnull id _ref;

- (nonnull instancetype)initWithRef:(_Nonnull id)ref;
- (void)sendEvent:(NSString* _Nullable)channel message:(NSString* _Nullable)message;
@end

#endif