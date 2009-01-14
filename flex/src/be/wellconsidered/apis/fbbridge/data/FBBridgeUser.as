package be.wellconsidered.apis.fbbridge.data
{
	import flash.utils.describeType;
	
	public class FBBridgeUser
	{
		public var uid:Number = 0;
		public var timezone:String = "";
		public var status:Object = null;
		public var sex:String = "";
		public var proxied_email:String = "";
		public var profile_url:String = "";
		public var pic_square_with_logo:String = "";
		public var pic_square:String = "";
		public var pic_small_with_logo:String = "";
		public var pic_small:String = "";
		public var pic_big_with_logo:String = "";
		public var pic_big:String = "";
		public var pic_with_logo:String = "";
		public var pic:String = "";
		public var name:String = "";
		public var first_name:String = "";
		public var last_name:String = "";
		public var is_app_user:String = "";
		public var hometown_location:String = "";
		public var birthday:String = "";
		public var about_me:String = "";
		
		public function FBBridgeUser(o:Object = null)
		{
			for(var i:String in o)
			{
				try
				{
					this[i] = o[i];
				}
				catch(err:Error)
				{}
			}
		}
		
		public function getFields():Array
		{
			var arrProps:Array = new Array();

			for(var i:int; i < describeType(this)..variable.length(); i++)
				arrProps.push(describeType(this)..variable[i].@name.toString());
			
			return arrProps;
		}
	}
}