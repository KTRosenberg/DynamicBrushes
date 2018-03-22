//
//  Variable.swift
//  PaletteKnife
//
//  Created by JENNIFER MARY JACOBS on 7/28/16.
//  Copyright © 2016 pixelmaid. All rights reserved.
//

import Foundation
import SwiftyJSON


class Signal:Observable<Float>{
    internal var hash:Float?
    internal var signalBuffer = [Float:Float]();
    
    internal var position:Int = 0;
    internal let fieldName:String!
    internal let displayName:String!
    internal let collectionId:String!;
    internal var order:Int = -1;
    
    static let stylusUp:Float = 0.0;
    static let stylusMove:Float = 1.0;
    static let stylusDown:Float = 2.0;
    
    var dataSubscribers = [String:Observable<Float>]();
    var id:String
    //    var param = Observable<Float>(1.0);
    required init(id:String,fieldName:String, displayName:String, collectionId:String, settings:JSON){
        self.id = id;
        self.fieldName = fieldName;
        self.collectionId = collectionId
        self.displayName = displayName;
        super.init(0)
    }
    
    public func setOrder(i:Int){
        self.order = i;
    }
    
 
    func cloneRawData(protoData:[Float:Float]){
        self.signalBuffer = protoData
    }
    
    override func get(id:String?) -> Float {
        
        let v:Float;
        
        v = signalBuffer[hash]!;
        
        self.setSilent(newValue: v);
        return super.get(id: id);
        
    }
    
    
    override func getSilent()->Float{
        return signalBuffer[hash]!
    }
    
    
    
    func setHash(h:Float){
        if(h != self.hash){
            let oldValue = self.get(id: nil);
            self.hash = h;
            let newValue = self.get(id: nil);

            self.didChange.raise(data: (self.id,oldValue,newValue))
        }
        
    }
    
    func setSignal(s:[Float]){
        self.signalBuffer.removeAll();
        for i in 0..<s.count{
            signalBuffer[Float(i)] = s[i];
        }
    }
    
    
    func addValue(h:Float,v:Float){
        signalBuffer[h] = v;
        print("current signal buffer",self.collectionId,self.displayName,signalBuffer);
        self.setHash(h:h);
    }
    
    func incrementIndex(){
        hash = hash+1.0;
    }
    
    func clearSignal(){
        signalBuffer.removeAll();
    }
    
    public func getCollectionName()->String?{
        return BehaviorManager.getCollectionName(id:self.collectionId);
    }
    
    
    public func getMetaJSON()->JSON{
        var metaJSON:JSON = [:]
        metaJSON["fieldName"] = JSON(self.fieldName);
        metaJSON["displayName"] = JSON(self.displayName);
        metaJSON["classType"] = JSON(String(describing: type(of: self)));
        metaJSON["settings"] = self.getSettingsJSON();
        return metaJSON;
    }
    
    //placeholder. needs to be overriden for signals with actual settings
    public func getSettingsJSON()->JSON{
        return JSON([:]);
    }
}

class TimeSignal:Signal{
    
}


class LiveSignal:Signal{
    required init(id: String, fieldName: String, displayName: String, collectionId: String, settings: JSON) {
        super.init(id: id, fieldName: fieldName, displayName: displayName, collectionId: collectionId, settings: settings);
        self.setLiveStatus(status: true);
    }
}


class Recording:LiveSignal{
    private var next:Recording?
    private var prev:Recording?
    private var lastSample:Float = 0;
    

    func getNext()->Recording?{
        if(next != nil){
            return next!;
        }
        return nil;
    }
    
    func getPrev()->Recording?{
        if(prev != nil){
            return prev!;
        }
        return nil; 
    }
    
    func setNext(r:Recording){
        next = r;
    }
    
    func setPrev(r:Recording){
        prev = r;
    }
    
    override func addValue(h:Float,v:Float){
        super.addValue(h: h, v: v);
        self.lastSample = h;
    }
    
    func getTimeOrderedList()->[Float]{
        var orderedList = [Float]();
        var hashValue = Float(0);
        while(hashValue <= self.lastSample){
            if(self.signalBuffer[hashValue] != nil){
                orderedList.append(signalBuffer[hashValue]!);
            }
            hashValue+=1.0;
        }
        
        return orderedList;
    }
}


class StylusEventRecording:Recording{
   
}

class StylusEvent:LiveSignal{
   
}











