package com.lepus.bridge.model;

import java.util.Map;

public class PlainProtocolMsg extends ProtocolMsg<ActionMsg<BaseModel, Map<String, String>>> {
    public String getType() {
        return message.message.type;
    }
}
