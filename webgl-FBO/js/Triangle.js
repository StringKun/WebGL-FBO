function Triangle(								//声明绘制用物体对象所属类
	gl,						 					//GL上下文
	programIn									//着色器程序id
){
	//this.vertexData=vertexDataIn;						//初始化顶点坐标数据
	this.vertexData= [3.0,0.0,0.0,
					  0.0,0.0,0.0,
					  0.0,3.0,0.0];
	this.vcount=this.vertexData.length/3;					//得到顶点数量
	this.vertexBuffer=gl.createBuffer();				//创建顶点坐标数据缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); 	//绑定顶点坐标数据缓冲
	//将顶点坐标数据送入缓冲
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);

    //接收顶点纹理坐标数据
   this.vertexTexCoor= [0.0, 1.0, 1.0, 1.0, 1.0, 0.0];
    //创建顶点纹理坐标缓冲
    this.vertexTexCoorBuffer=gl.createBuffer();
    //将顶点纹理坐标数据送入缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexTexCoorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexTexCoor),gl.STATIC_DRAW);

    this.program=programIn;		//初始化着色器程序id

    //设置纹理
    gl.uniform1i(gl.getUniformLocation(this.program, "sTexture"), 0);

	this.drawSelf=function(ms, tex)//绘制物体的方法
	{	
		gl.useProgram(this.program);//指定使用某套着色器程序
		//获取总变换矩阵引用id
		var uMVPMatrixHandle=gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));
		
		gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		gl.vertexAttribPointer(gl.getAttribLocation(this.program,"aPosition"),3,gl.FLOAT,false,0, 0);

        //启用纹理坐标数据
        gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "aTexCoor"));
        //将顶点纹理坐标数据送入渲染管线
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoorBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aTexCoor"), 2, gl.FLOAT, false, 0, 0);			//一定要每次都取消绑定，在这里卡了很久

        var isImg = gl.getUniformLocation(this.program, 'isImg');
        if(tex){
            // gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(isImg, true);
		}else{
            gl.uniform1i(isImg, false);
		}

        //一定要每次都取消绑定，在这里卡了很久
        gl.drawArrays(gl.TRIANGLES, 0, this.vcount);		//用顶点法绘制物体
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
